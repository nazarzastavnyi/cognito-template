import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterRequestDto from './dto/register.request.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import JwtAuthenticationGuard from '@common/auth/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register new user. Availability: A.' })
  @ApiTags('user')
  @Post('register')
  async register(@Body() registerRequest: RegisterRequestDto) {
    registerRequest.email = registerRequest.email.toLowerCase();
    await this.authService.register(registerRequest);
  }

  @ApiOperation({ summary: 'Validate jwt token' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  @Get('validate')
  validateToken(@Req() request) {
    return { statusCode: 200, message: 'Token is valid' };
  }
}
