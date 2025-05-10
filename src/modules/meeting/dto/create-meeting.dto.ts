import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMeetingDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;
}
