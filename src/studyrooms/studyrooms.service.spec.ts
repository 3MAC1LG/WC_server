import { Test, TestingModule } from '@nestjs/testing';
import { StudyroomsService } from './studyrooms.service';

describe('StudyroomsService', () => {
  let service: StudyroomsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StudyroomsService],
    }).compile();

    service = module.get<StudyroomsService>(StudyroomsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});