import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { ClassroomMembers } from '../entities/ClassroomMembers';
import { Classrooms } from '../entities/Classrooms';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { Studyrooms } from 'src/entities/Studyrooms';
import { StudyroomMembers } from 'src/entities/StudyroomMembers';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { diskStorage } from 'Multer';
import fs from 'fs';
import { extname } from 'path';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Classrooms,
      ClassroomMembers,
      Studyrooms,
      StudyroomMembers,
    ]),
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
            const dest = 'uploads/classThumb';

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
  providers: [ClassroomsService],
  controllers: [ClassroomsController],
})
export class ClassroomsModule {}
