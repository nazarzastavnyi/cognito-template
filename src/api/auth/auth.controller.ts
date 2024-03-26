import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import RegisterRequestDto from './dto/register.request.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '@common/auth/guards/jwt.guard';
import { RegisterCommand } from '@api/auth/dto/register.command';
import { AuthInteractor } from '@api/auth/auth.interactor';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthInteractor) {}

  @ApiOperation({ summary: 'Register new user. Availability: A.' })
  @ApiTags('user')
  @Post('register')
  async register(@Body() registerRequest: RegisterRequestDto) {
    const registerCommand = new RegisterCommand(registerRequest.email);
    await this.authService.register(registerCommand);
  }

  @ApiOperation({ summary: 'Validate jwt token' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  @Get('validate')
  validateToken(@Req() request) {
    return { statusCode: 200, message: 'Token is valid' };
  }
}
