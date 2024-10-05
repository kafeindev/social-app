import { IsJWT, IsNotEmpty, IsString } from "class-validator";

export class RefreshTokensDto {
  @IsString()
  @IsNotEmpty({ message: "Refresh token is required" })
  @IsJWT({ message: "Refresh token is not valid" })
  refreshToken: string;
}
