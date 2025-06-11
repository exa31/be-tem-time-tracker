import { Module } from '@nestjs/common';
import { TimeSessionService } from './time-session.service';
import { TimeSessionController } from './time-session.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TimeSession, TimeSessionSchema } from './schema/time-session.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TimeSession.name, schema: TimeSessionSchema },
    ]),
  ],
  controllers: [TimeSessionController],
  providers: [TimeSessionService],
})
export class TimeSessionModule {}
