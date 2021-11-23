import { ApiProperty } from '@nestjs/swagger';

export class CreateStudyroomDto {
  @ApiProperty({
    example: '공부방',
    description: '스터디룸명',
  })
  public name: string;
}