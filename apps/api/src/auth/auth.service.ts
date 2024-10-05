import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { TokenType, User as UserModel } from "@prisma/client";
import { compare, hash } from "bcrypt";
import moment from "moment";

import { PrismaService } from "~/shared/services/prisma.service";

import { UserService } from "../user/user.service";
import { LoginDto, RefreshTokensDto, SignupDto } from "./dto";
import { LogoutDto } from "./dto/logout.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, username, password } = signupDto;

    const userExists = await this.userService.find({
      OR: [{ email }, { username }],
    });
    if (userExists) {
      throw new ConflictException("User already exists");
    }

    const hashedPassword = await hash(password, 10);

    const user = await this.userService.create({
      email,
      username,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    });

    const authTokens = await this.createAuthTokens(user.id);
    return { user, ...authTokens };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.validateUser(email, password);
    const authTokens = await this.createAuthTokens(user.id);

    return { user, ...authTokens };
  }

  async logout(logoutDto: LogoutDto) {
    const { refreshToken, accessToken } = logoutDto;

    if (refreshToken) {
      await this.deleteToken(refreshToken);
    }

    if (accessToken) {
      await this.deleteToken(accessToken);
    }

    return { success: true };
  }

  async refreshTokens(refreshTokensDto: RefreshTokensDto) {
    const { refreshToken } = refreshTokensDto;

    const token = await this.prismaService.token.findFirst({
      where: { token: refreshToken, type: TokenType.REFRESH },
    });

    if (!token || token.expiresAt < new Date()) {
      throw new UnauthorizedException("Invalid refresh token");
    }

    const user = await this.userService.find({ id: token.userId });
    const authTokens = await this.createAuthTokens(user.id);

    return { user, ...authTokens };
  }

  async createAuthTokens(userId: number): Promise<{
    access: {
      token: string;
      expiresAt: Date;
    };
    refresh: {
      token: string;
      expiresAt: Date;
    };
  }> {
    const accessTokenExpiresAt = moment().add(
      this.configService.get("JWT_ACCESS_TOKEN_EXPIRATION_TIME"),
      "seconds"
    );
    const refreshTokenExpiresAt = moment().add(
      this.configService.get("JWT_REFRESH_TOKEN_EXPIRATION_TIME"),
      "seconds"
    );

    const accessToken = await this.createToken(
      TokenType.ACCESS,
      userId,
      accessTokenExpiresAt
    );
    const refreshToken = await this.createToken(
      TokenType.REFRESH,
      userId,
      refreshTokenExpiresAt
    );

    return {
      access: {
        token: accessToken,
        expiresAt: accessTokenExpiresAt.toDate(),
      },
      refresh: {
        token: refreshToken,
        expiresAt: refreshTokenExpiresAt.toDate(),
      },
    };
  }

  async createToken(
    type: TokenType,
    userId: number,
    expiresAt: moment.Moment,
    saveToDatabase: boolean = true
  ) {
    const iat = moment().unix();
    const exp = expiresAt.unix();

    const payload = { sub: userId, iat, exp, type };
    const token = this.jwtService.sign(payload);

    if (saveToDatabase) {
      await this.prismaService.token.create({
        data: {
          token,
          expiresAt: expiresAt.toDate(),
          type,
          user: {
            connect: {
              id: Number(userId),
            },
          },
        },
      });
    }

    return token;
  }

  async deleteToken(token: string) {
    await this.prismaService.token.deleteMany({
      where: { token },
    });
  }

  async validateUser(
    email: string,
    password: string
  ): Promise<UserModel | null> {
    const user = await this.userService.find({ email }, { password: true });

    if (!user || !user.password) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const hashedPassword = user.password.hash;

    const isPasswordValid = await compare(password, hashedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    delete user.password;

    return user;
  }
}
