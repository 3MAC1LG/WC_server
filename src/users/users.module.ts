import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { ClassroomMembers } from '../entities/ClassroomMembers';
import { MulterModule } from '@nestjs/platform-express';
import fs from 'fs';
import { diskStorage } from 'Multer';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, ClassroomMembers]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        fileFilter: (request, file, cd) => {
          if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
            cd(null, true);
          } else {
            cd(null, false);
          }
        },
        storage: diskStorage({
          destination: (req, file, cb) => {
            const dest = 'uploads/userThumb';

            if (!fs.existsSync(dest)) {
              fs.mkdirSync(dest, { recursive: true });
            }
            cb(null, dest);
          },
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
