import { CacheModuleAsyncOptions } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-yet";

export const CacheConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: (configService: ConfigService) => {
    return {
      store: redisStore,
      url: configService.get("REDIS_URL"),
    };
  },
  inject: [ConfigService],
};
