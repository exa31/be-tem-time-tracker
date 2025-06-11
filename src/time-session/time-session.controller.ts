import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { TimeSessionService } from './time-session.service';
import { CreateTimeSessionDto } from './dto/create-time-session.dto';
import { UpdateTimeSessionDto } from './dto/update-time-session.dto';
import { TimeSession } from './schema/time-session.schema';
import ResponseModel from '../model/response.model';
import { MyLogger } from '../lib/logger';
import { Request } from 'express';

@Controller('time-session')
export class TimeSessionController {
  constructor(
    private readonly timeSessionService: TimeSessionService,
    private logger: MyLogger,
  ) {}

  @Post()
  create(@Body() createTimeSessionDto: CreateTimeSessionDto) {
    return this.timeSessionService.create(createTimeSessionDto);
  }

  @Get()
  async findAll(
    @Req() request: Request,
  ): Promise<ResponseModel<TimeSession[]>> {
    return await this.timeSessionService.getAllTimeSessions(request.id_user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.timeSessionService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTimeSessionDto: UpdateTimeSessionDto,
  ) {
    return this.timeSessionService.update(+id, updateTimeSessionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.timeSessionService.remove(+id);
  }
}
