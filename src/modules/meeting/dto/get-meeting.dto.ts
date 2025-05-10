import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetMeetingsDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  page: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  pageSize: number;
}
