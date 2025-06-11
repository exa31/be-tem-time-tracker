import { Injectable } from '@nestjs/common';
import { CreateTimeSessionDto } from './dto/create-time-session.dto';
import { UpdateTimeSessionDto } from './dto/update-time-session.dto';
import ResponseModel from '../model/response.model';
import { TimeSession } from './schema/time-session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from '../excecption/bad-request.exception';
import { MyLogger } from '../lib/logger';

@Injectable()
export class TimeSessionService {
  constructor(
    @InjectModel(TimeSession.name) private timeSessionModel: Model<TimeSession>,
    private logger: MyLogger,
  ) {}

  create(createTimeSessionDto: CreateTimeSessionDto) {
    return 'This action adds a new timeSession';
  }

  async getAllTimeSessions(
    userId: string,
  ): Promise<ResponseModel<TimeSession[]>> {
    try {
      const timeSessions = await this.timeSessionModel
        .find({ userId })
        .sort({ createdAt: -1 })
        .exec();

      return {
        success: true,
        data: timeSessions,
        message: 'Time sessions retrieved successfully',
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error retrieving time sessions: ${error.message}`);
      throw new BadRequestException('Failed to retrieve time sessions');
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} timeSession`;
  }

  update(id: number, updateTimeSessionDto: UpdateTimeSessionDto) {
    return `This action updates a #${id} timeSession`;
  }

  remove(id: number) {
    return `This action removes a #${id} timeSession`;
  }
}
