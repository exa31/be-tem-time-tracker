import { Test, TestingModule } from '@nestjs/testing';
import { TimeSessionService } from './time-session.service';

describe('TimeSessionService', () => {
  let service: TimeSessionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TimeSessionService],
    }).compile();

    service = module.get<TimeSessionService>(TimeSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
