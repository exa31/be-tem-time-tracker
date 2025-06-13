import { Controller, Get, Post, Put, Req } from '@nestjs/common';
import { TimeSessionService } from './time-session.service';
import { TimeSession } from './schema/time-session.schema';
import ResponseModel from '../model/response.model';
import { MyLogger } from '../lib/logger';
import { Request } from 'express';

@Controller('time-sessions')
export class TimeSessionController {
  constructor(
    private readonly timeSessionService: TimeSessionService,
    private logger: MyLogger,
  ) {}

  @Post('start')
  create(@Req() request: Request) {
    console.log(request.id_user);
    return this.timeSessionService.startTimeSession(request.id_user);
  }

  @Put('stop')
  async stopTimeSession(@Req() request: Request): Promise<ResponseModel<null>> {
    return await this.timeSessionService.stopTimeSession(request.id_user);
  }

  @Get()
  async findAll(
    @Req() request: Request,
  ): Promise<ResponseModel<TimeSession[]>> {
    return await this.timeSessionService.getAllTimeSessions(request.id_user);
  }

  @Get('active')
  async getActiveTimeSession(
    @Req() request: Request,
  ): Promise<ResponseModel<TimeSession | null>> {
    return await this.timeSessionService.getActiveTimeSession(request.id_user);
  }
}
