import path from "path";

import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { MulterModule } from "@nestjs/platform-express";
import { ThrottlerModule } from "@nestjs/throttler";
import { memoryStorage } from "multer";
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from "nestjs-i18n";

import { validate } from "~/shared/validators/env.validation";
import { UserModule } from "~/user/user.module";

import { AuthModule } from "./auth/auth.module";
import { CacheConfig } from "./shared/configs/cache.config";
import { JwtAuthGuard } from "./shared/guards/auth.guard";
import { PrismaModule } from "./shared/services/prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
      validate: validate,
    }),
    CacheModule.registerAsync(CacheConfig),
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "/shared/i18n"),
        watch: true,
      },
      resolvers: [
        {
          use: QueryResolver,
          options: ["lang"],
        },
        AcceptLanguageResolver,
        new HeaderResolver(["lang"]),
      ],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    PrismaModule,
    AuthModule,
    UserModule,
    MulterModule.register({
      storage: memoryStorage(),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
