import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { TokenType } from "@prisma/client";
import { ExtractJwt, Strategy } from "passport-jwt";

import { PrismaService } from "~/shared/services/prisma.service";
import { User as UserModel } from "@prisma/client";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly prismaService: PrismaService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get("JWT_ACCESS_TOKEN_SECRET"),
    });
  }

  async validate(payload: {
    iat: number;
    exp: number;
    sub: number;
    type: TokenType;
  }): Promise<UserModel> {
    const { iat, exp, sub, type } = payload;

    if (type !== TokenType.ACCESS) {
      throw new UnauthorizedException();
    }

    if (iat > exp) {
      throw new UnauthorizedException();
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: sub,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
