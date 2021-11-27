import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { ClassroomMembers } from 'src/entities/ClassroomMembers';
import { Classrooms } from 'src/entities/Classrooms';
import { Users } from 'src/entities/Users';
import { Chats } from 'src/entities/Chats';
import { Comments } from 'src/entities/Comments';
import { Qnas } from 'src/entities/Qnas';
import { Sections } from 'src/entities/Sections';
import { StudyroomMembers } from 'src/entities/StudyroomMembers';
import { Studyrooms } from 'src/entities/Studyrooms';
import { Videos } from 'src/entities/Videos';
import { Wishlists } from 'src/entities/Wishlists';
dotenv.config();
const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    Users,
    ClassroomMembers,
    Classrooms,
    Chats,
    Comments,
    Qnas,
    Sections,
    StudyroomMembers,
    Studyrooms,
    Videos,
    Wishlists,
  ],
  migrations: [__dirname + '/src/migrations/*.ts'],
  cli: { migrationsDir: 'src/migrations' },
  autoLoadEntities: true,
  cache: true,
  charset: 'utf8mb4',
  synchronize: false,
  logging: true,
  keepConnectionAlive: true,
};
export = config;
