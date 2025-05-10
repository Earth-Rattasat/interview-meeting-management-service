import { ApiProperty } from '@nestjs/swagger';

export class SingleResponseDto<T> {
  @ApiProperty()
  data: T;
}

export class ListResponseDto<T> {
  @ApiProperty()
  data: T;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  pageSize?: number;

  @ApiProperty()
  totalItems: number;
}
