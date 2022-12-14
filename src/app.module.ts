import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SoortyModule } from './soorty/soorty.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import JWTConfig from './config/jwt.config';
import ThrottleConfig from './config/throttler.config';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import I18nConfig from './config/i18n.config';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { AlkaramModule } from './alkaram/alkaram.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [JWTConfig, ThrottleConfig, I18nConfig],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('throttle').THROTTLE_TTL,
        limit: config.get('throttle').THROTTLE_LIMIT,
      }),
    }),
    I18nModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        fallbackLanguage: config.get('i18n').DEFAULT_LANG,
        parserOptions: {
          path: path.join(__dirname, '/i18n/'),
          watch: true,
        },
      }),
      parser: I18nJsonParser,
      inject: [ConfigService],
    }),
    SoortyModule,
    AlkaramModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }

