import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateDisplayNameDto {
  @IsString()
  @IsNotEmpty({ message: "Display name is required" })
  @MinLength(3, { message: "Display name must be at least 3 characters long" })
  @MaxLength(32, { message: "Display name must be at most 32 characters long" })
  displayName: string;
}
