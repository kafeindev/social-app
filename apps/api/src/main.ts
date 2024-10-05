import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory, Reflector } from "@nestjs/core";
import {
  ExpressAdapter,
  NestExpressApplication,
} from "@nestjs/platform-express";
import helmet from "helmet";

import { AppModule } from "./app.module";

function setupApp(app: NestExpressApplication, configService: ConfigService) {
  app.enable("trust proxy");
  app.use(helmet());
  app.enableCors({
    origin: configService.get("WEB_URL"),
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  });
  app.useBodyParser("json", { limit: "10mb" });
  app.useBodyParser("urlencoded", {
    limit: "10mb",
    extended: true,
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
  });
}

async function startNestApplication() {
  try {
    const app = await NestFactory.create<NestExpressApplication>(
      AppModule,
      new ExpressAdapter()
    );

    const configService = app.get(ConfigService);
    const reflector = app.get(Reflector);

    setupApp(app, configService);

    // app.useGlobalGuards(new JwtAuthGuard(reflector));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

    const logger = new Logger();
    app.useLogger(logger);

    const port = configService.get("APP_PORT") || 8080;
    await app.listen(port);
    logger.log(`Server is running on port ${port}`);
  } catch (error) {
    console.error("Failed to start the application:", error);
    process.exit(1);
  }
}

startNestApplication();
