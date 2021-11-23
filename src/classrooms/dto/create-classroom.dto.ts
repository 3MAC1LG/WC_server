import { ApiProperty } from '@nestjs/swagger';

export class CreateClassroomDto {
  @ApiProperty({
    example: '리액트란?',
    description: '클래스룸 타이틀',
  })
  public title: string;

  @ApiProperty({
    example: '프론트엔드 개발을 위한 강의입니다.',
    description: '클래스룸 설명',
  })
  public desc: string;

  @ApiProperty({
    example: '["1강 프론트엔드 소개", "2강 프론트엔드 기초"]',
    description: '섹션 제목',
  })
  public sections: number; //string[]이 안됨

  @ApiProperty({
    example: '솔봉',
    description: '강사님',
  })
  public OwnerId: number;
}
