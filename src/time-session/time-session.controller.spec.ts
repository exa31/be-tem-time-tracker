import { Test, TestingModule } from '@nestjs/testing';
import { TimeSessionController } from './time-session.controller';
import { TimeSessionService } from './time-session.service';

describe('TimeSessionController', () => {
  let controller: TimeSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeSessionController],
      providers: [TimeSessionService],
    }).compile();

    controller = module.get<TimeSessionController>(TimeSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
