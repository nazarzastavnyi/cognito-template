import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterRequestDto from './dto/register.request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '@common/auth/guards/jwt.guard';

@Controller('auth')
@UseGuards(JwtAuthenticationGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register new user. Availability: A.' })
  @ApiTags('user')
  @Post('register')
  async register(@Body() registerRequest: RegisterRequestDto) {
    registerRequest.email = registerRequest.email.toLowerCase();
    await this.authService.register(registerRequest);
  }
}
