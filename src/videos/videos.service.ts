import { HttpException, Injectable } from '@nestjs/common';
import { Sections } from 'src/entities/Sections';
import { Studyrooms } from 'src/entities/Studyrooms';
import { Videos } from 'src/entities/Videos';
import { getManager } from 'typeorm';

@Injectable()
export class VideoService {
  async getVideoBySectionID(sectionId: number) {
    if (!sectionId) {
      throw new HttpException('리퀘스트 데이터가 존재하지 않습니다', 403);
    }
    try {
      const section = await getManager()
        .getRepository(Sections)
        .createQueryBuilder('section')
        .where('section.id = :id', { id: sectionId })
        .getOne();
      if (!section) {
        throw new HttpException('섹션을 불러오지 못했습니다', 401);
      }
      const video = await getManager()
        .getRepository(Sections)
        .createQueryBuilder('section')
        .leftJoinAndSelect('section.Videos', 'video')
        .where('section.id = :id', { id: sectionId })
        .getMany();
      if (!video) {
        throw new HttpException('비디오를 불러오지 못했습니다', 401);
      }
      return video;
    } catch (e) {
      console.error(e);
    }
  }
  async registerVideo(title: string, videoUrl: string, sectionId: number) {
    if (!title && !videoUrl && !sectionId) {
      throw new HttpException('리퀘스트 데이터가 존재하지 않습니다', 403);
    }
    try {
      const section = await getManager()
        .getRepository(Sections)
        .findOne({ where: { id: sectionId } });

      if (!section) {
        throw new HttpException('저장할 섹션이 존재하지 않습니다', 401);
      }

      const video = await getManager()
        .getRepository(Videos)
        .create({ title, videoUrl, SectionId: sectionId });

      if (!video) {
        throw new HttpException('비디오 저장에 실패했습니다', 401);
      }

      await getManager().getRepository(Videos).save(video);
      return { success: true, msg: '비디오 저장에 성공했습니다' };
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  async getStudyroomVideo(studyroomId: number) {
    if (!studyroomId) {
      throw new HttpException('리퀘스트 데이터가 존재하지 않습니다', 403);
    }
    try {
      const studyroom = await getManager()
        .getRepository(Studyrooms)
        .createQueryBuilder('studyroom')
        .where('studyroom.id = :id', { id: studyroomId })
        .getOne();
      if (!studyroom) {
        throw new HttpException('스터디룸이 존재하지 않습니다', 401);
      }
      const video = await getManager()
        .getRepository(Videos)
        .createQueryBuilder('video')
        .where('video.');
    } catch (e) {
      console.error(e);
    }
  }
}
