import { ApiPropertyOptional } from '@nestjs/swagger';
import { MeetingStatus } from 'src/entities/meeting.entity';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateMeetingDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEnum(MeetingStatus)
  @Type(() => String)
  status: MeetingStatus;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  archive: boolean;
}
