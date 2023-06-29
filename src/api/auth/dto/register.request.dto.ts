import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export default class RegisterRequestDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @ApiProperty()
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(50)
  @ApiProperty()
  lastName: string;
}
