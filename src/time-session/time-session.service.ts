import { Injectable } from '@nestjs/common';
import ResponseModel from '../model/response.model';
import { TimeSession } from './schema/time-session.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BadRequestException } from '../excecption/bad-request.exception';
import { MyLogger } from '../lib/logger';
import { InternalServerException } from '../excecption/internal-server.exception';

@Injectable()
export class TimeSessionService {
  constructor(
    @InjectModel(TimeSession.name) private timeSessionModel: Model<TimeSession>,
    private logger: MyLogger,
  ) {}

  async startTimeSession(id_user: string): Promise<ResponseModel<null>> {
    try {
      const newTimeSession = new this.timeSessionModel({
        id_user: id_user,
        startTime: new Date(),
      });
      await newTimeSession.save();

      return {
        success: true,
        data: null,
        message: 'Time session started successfully',
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error creating time session: ${error.message}`);
      throw new InternalServerException('Failed to start time session');
    }
  }

  async getAllTimeSessions(
    id_user: string,
  ): Promise<ResponseModel<TimeSession[]>> {
    try {
      const timeSessions = await this.timeSessionModel
        .find({ id_user })
        .sort({ createdAt: -1 })
        .exec();

      return {
        success: true,
        data: timeSessions.map((item) => item.toJSON()),
        message: 'Time sessions retrieved successfully',
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error retrieving time sessions: ${error.message}`);
      throw new InternalServerException('Failed to retrieve time sessions');
    }
  }

  async getActiveTimeSession(
    id_user: string,
  ): Promise<ResponseModel<TimeSession | null>> {
    try {
      const activeSession = await this.timeSessionModel
        .findOne({ id_user, end_time: null })
        .exec();
      if (!activeSession) {
        this.logger.warn('No active time session found for user');
        return {
          success: true,
          data: null,
          message: 'No active time session found',
          timestamp: new Date(),
        };
      }
      return {
        success: true,
        data: activeSession,
        message: 'Active time session retrieved successfully',
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(
        `Error retrieving active time session: ${error.message}`,
      );
      if (error instanceof BadRequestException) {
        throw error; // Rethrow specific exceptions
      }
      throw new InternalServerException(
        'Failed to retrieve active time session',
      );
    }
  }

  async stopTimeSession(id_user: string): Promise<ResponseModel<null>> {
    try {
      const updatedSession = await this.timeSessionModel
        .findOneAndUpdate(
          { id_user, endTime: null },
          { end_time: new Date() },
          { new: true },
        )
        .exec();

      if (!updatedSession) {
        throw new BadRequestException('No active time session found to end');
      }

      return {
        success: true,
        data: null,
        message: 'Time session ended successfully',
        timestamp: new Date(),
      };
    } catch (error) {
      this.logger.error(`Error ending time session: ${error.message}`);
      if (error instanceof BadRequestException) {
        throw error; // Rethrow specific exceptions
      }
      throw new InternalServerException('Failed to end time session');
    }
  }
}
