import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<
  D extends Record<string, any> = Record<string, any>,
> {
  @ApiProperty()
  public data: D;

  @ApiProperty()
  public meta?: Record<string, any>;
}
