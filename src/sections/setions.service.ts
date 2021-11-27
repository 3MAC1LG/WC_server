import { HttpException, Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { Sections } from 'src/entities/Sections';

@Injectable()
export class SectionService {
  constructor() {}

  async createSection(classroomId: number, title: string) {
    if (!classroomId && !title) {
      throw new HttpException('리퀘스트 데이터가 존재하지 않습니다', 403);
    }
    try {
      const section = await getManager()
        .getRepository(Sections)
        .create({ title, ClassroomId: classroomId });
      if (!section) {
        throw new HttpException('섹션 저장에 실패했습니다', 401);
      }
      await getManager().getRepository(Sections).save(section);
      return { success: true, msg: '데이터베이스에 성공적으로 저장했습니다' };
    } catch (e) {
      console.error(e);
    }
  }
}
