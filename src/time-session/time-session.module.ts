import { Module } from '@nestjs/common';
import { TimeSessionService } from './time-session.service';
import { TimeSessionController } from './time-session.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeSession, TimeSessionSchema } from './schema/time-session.schema';
import { LoggerModule } from '../lib/logger';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TimeSession.name, schema: TimeSessionSchema },
    ]),
    LoggerModule,
  ],
  controllers: [TimeSessionController],
  providers: [TimeSessionService],
})
export class TimeSessionModule {}
