import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class SignInRequestDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
