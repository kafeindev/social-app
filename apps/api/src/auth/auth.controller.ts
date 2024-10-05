import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { User as UserModel } from "@prisma/client";

import { User } from "~/shared/decorators/user.decorator";

import { AuthService } from "./auth.service";
import { LoginDto, RefreshTokensDto, SignupDto } from "./dto";
import { LogoutDto } from "./dto/logout.dto";
import { Public } from "~/shared/decorators/public.decorator";

@Controller({
  version: "1",
  path: "auth",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("signup")
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Public()
  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post("logout")
  async logout(@Body() logoutDto: LogoutDto) {
    return this.authService.logout(logoutDto);
  }

  @Post("refresh-tokens")
  async refreshTokens(@Body() refreshTokensDto: RefreshTokensDto) {
    return this.authService.refreshTokens(refreshTokensDto);
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  async getCurrentUser(@User() user: UserModel) {
    return user;
  }
}
