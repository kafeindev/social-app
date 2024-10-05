import { IsOptional, IsString } from "class-validator";

export class LogoutDto {
  @IsOptional()
  @IsString()
  refreshToken?: string;

  @IsOptional()
  @IsString()
  accessToken?: string;
}
