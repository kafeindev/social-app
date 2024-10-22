import { Module } from "@nestjs/common";

import { AwsS3Service } from "~/shared/services/aws-s3/aws-s3.service";
import { PrismaModule } from "~/shared/services/prisma/prisma.module";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [PrismaModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService, AwsS3Service],
})
export class UserModule {}
