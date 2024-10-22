import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, User as UserModel } from "@prisma/client";
import sharp from "sharp";

import { AwsS3Service } from "~/shared/services/aws-s3/aws-s3.service";
import { PrismaService } from "~/shared/services/prisma/prisma.service";

import { UpdateDisplayNameDto, UpdateUsernameDto } from "./dto";

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly awsS3Service: AwsS3Service
  ) {}

  async createUser(
    data: Omit<Prisma.UserCreateInput, "createdAt" | "updatedAt">
  ): Promise<UserModel> {
    return this.prismaService.user.create({ data });
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
    include?: Prisma.UserInclude
  ): Promise<Prisma.UserGetPayload<{ include: Prisma.UserInclude }>> {
    return this.prismaService.user.update({ where, data, include });
  }

  async updateUsername(userId: number, updateUsernameDto: UpdateUsernameDto) {
    const { username } = updateUsernameDto;

    const userExists = await this.findUser({ username });
    if (userExists) {
      throw new ConflictException("Username already exists");
    }

    return this.updateUser({ id: userId }, { username });
  }

  async updateDisplayName(
    userId: number,
    updateDisplayNameDto: UpdateDisplayNameDto
  ) {
    const { displayName } = updateDisplayNameDto;

    return this.updateUser({ id: userId }, { displayName });
  }

  async updateAvatar(userId: number, file: Express.Multer.File) {
    const buffer = await sharp(file.buffer)
      .resize({ width: 512, height: 512 })
      .webp({ quality: 80 })
      .toBuffer();

    const key = `avatars/${userId}.webp`;
    await this.awsS3Service.uploadFile(buffer, key);

    return this.awsS3Service.getFileUrl(key);
  }

  async deleteAvatar(userId: number) {
    const key = `avatars/${userId}.webp`;
    await this.awsS3Service.deleteFile(key);
  }

  async findUser(
    where: Prisma.UserWhereInput,
    include?: Prisma.UserInclude
  ): Promise<Prisma.UserGetPayload<{ include: Prisma.UserInclude }>> {
    return this.prismaService.user.findFirst({
      where,
      include,
    });
  }

  async getUserAvatarUrl(userId: number) {
    const key = `avatars/${userId}.webp`;

    if (!(await this.awsS3Service.checkFileExists(key))) {
      throw new NotFoundException("Avatar not found");
    }

    return this.awsS3Service.getFileUrl(key);
  }
}
