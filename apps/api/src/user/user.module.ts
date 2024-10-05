import { Module } from "@nestjs/common";

import { PrismaModule } from "~/shared/services/prisma.module";

import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [PrismaModule],
  exports: [UserService],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
