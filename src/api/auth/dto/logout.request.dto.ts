import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LogoutRequestDto {
  @IsString()
  @ApiProperty()
  refreshToken: string;
}
