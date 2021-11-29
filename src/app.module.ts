import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import * as ormconfig from '../ormconfig';
import { ClassroomsModule } from './classrooms/classrooms.module';
import { SectionModule } from './sections/setions.module';
import { OauthModule } from './oauth/oauth.module';
import { VideoModule } from './videos/videos.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { StudyroomsModule } from './studyrooms/studyrooms.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(ormconfig),
    AuthModule,
    UsersModule,
    ClassroomsModule,
    SectionModule,
    OauthModule,
    VideoModule,
    WishlistsModule,
    StudyroomsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
