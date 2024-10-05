import { plainToInstance } from "class-transformer";
import { IsNotEmpty, IsString, IsNumber, validateSync } from "class-validator";

class EnvironmentVariables {
  @IsNumber()
  @IsNotEmpty()
  APP_PORT: number;

  @IsString()
  @IsNotEmpty()
  WEB_URL: string;

  @IsString()
  @IsNotEmpty()
  JWT_ACCESS_TOKEN_SECRET: string;

  @IsNumber()
  @IsNotEmpty()
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: number;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_SECRET: string;

  @IsNumber()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: number;

  @IsString()
  @IsNotEmpty()
  REDIS_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
