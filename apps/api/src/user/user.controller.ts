import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { User as UserModel } from "@prisma/client";

import { User } from "~/shared/decorators/user.decorator";

import { UpdateDisplayNameDto, UpdateUsernameDto } from "./dto";
import { UserService } from "./user.service";

@Controller({
  version: "1",
  path: "user",
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch("username")
  async updateUsername(
    @User() user: UserModel,
    @Body() updateUsernameDto: UpdateUsernameDto
  ) {
    return this.userService.updateUsername(user.id, updateUsernameDto);
  }

  @Patch("display-name")
  async updateDisplayName(
    @User() user: UserModel,
    @Body() updateDisplayNameDto: UpdateDisplayNameDto
  ) {
    return this.userService.updateDisplayName(user.id, updateDisplayNameDto);
  }

  @Get("avatar")
  async getUserAvatarUrl(@User() user: UserModel) {
    return this.userService.getUserAvatarUrl(user.id);
  }

  @Put("avatar")
  @UseInterceptors(FileInterceptor("file"))
  async updateAvatar(
    @User() user: UserModel,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5000000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|jpg|png|webp)/ }),
        ],
        fileIsRequired: true,
      })
    )
    file: Express.Multer.File
  ) {
    return this.userService.updateAvatar(user.id, file);
  }
}
