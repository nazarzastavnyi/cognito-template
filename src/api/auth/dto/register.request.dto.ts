import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class RegisterRequestDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
