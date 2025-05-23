import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MeetingService } from './meeting.service';
import UserGuard from '../auth/guards/user.guard';
import { UserInfoDecorator } from '../auth/decorators/user.decorator';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { Meeting } from 'src/entities/meeting.entity';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { GetMeetingsDto } from './dto/get-meeting.dto';
import {
  ListResponseDto,
  SingleResponseDto,
} from 'src/utils/base-response-dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@UseGuards(UserGuard)
@ApiTags('Meeting')
@ApiBearerAuth()
@Controller('meeting')
export class MeetingController {
  constructor(private readonly meetingService: MeetingService) {}

  @Post()
  async createMeeting(
    @Body() payload: CreateMeetingDto,
    @UserInfoDecorator() user,
  ): Promise<SingleResponseDto<Meeting>> {
    const data = await this.meetingService.createMeeting(payload, user);
    return {
      data,
    };
  }

  @Get()
  async getMeetings(
    @Query() payload: GetMeetingsDto,
  ): Promise<ListResponseDto<Meeting[]>> {
    const [data, totalItems] = await this.meetingService.getMeetings(payload);
    return {
      data,
      page: Number(payload.page ?? 1),
      pageSize: Number(payload.pageSize ?? 10),
      totalItems,
    };
  }

  @ApiParam({ name: 'id', required: true, type: String })
  @Get(':id')
  async getMeeting(
    @Param('id') id: string,
  ): Promise<SingleResponseDto<Meeting>> {
    const data = await this.meetingService.getMeetingById(id);
    return {
      data,
    };
  }

  @ApiParam({ name: 'id', required: true, type: String })
  @Patch(':id')
  async updateMeeting(
    @Param('id') id: string,
    @Body() payload: UpdateMeetingDto,
  ): Promise<SingleResponseDto<Meeting>> {
    const data = await this.meetingService.updateMeeting(id, payload);
    return {
      data,
    };
  }
}
