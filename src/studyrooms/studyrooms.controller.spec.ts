import { Test, TestingModule } from '@nestjs/testing';
import { StudyroomsController } from './studyrooms.controller';

describe('StudyroomsController', () => {
  let controller: StudyroomsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudyroomsController],
    }).compile();

    controller = module.get<StudyroomsController>(StudyroomsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});