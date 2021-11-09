import { ApiProperty } from '@nestjs/swagger';

export class CreateClassroomDto {
  @ApiProperty({
    example: '솔봉',
    description: '클래스명',
  })
  public classroom: string;

  @ApiProperty({
    example: 'sleact',
    description: 'url 주소',
  })
  public url: string;
}