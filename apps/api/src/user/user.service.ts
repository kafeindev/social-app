import { Injectable } from "@nestjs/common";
import { Prisma, User as UserModel } from "@prisma/client";

import { PrismaService } from "~/shared/services/prisma.service";

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.UserCreateInput): Promise<UserModel> {
    return this.prismaService.user.create({ data });
  }

  async update(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    include?: Prisma.UserInclude
  ): Promise<Prisma.UserGetPayload<{ include: Prisma.UserInclude }>> {
    return this.prismaService.user.update({ where, data, include });
  }

  async find(
    where: Prisma.UserWhereInput,
    include?: Prisma.UserInclude
  ): Promise<Prisma.UserGetPayload<{ include: Prisma.UserInclude }>> {
    return this.prismaService.user.findFirst({
      where,
      include,
    });
  }
}
