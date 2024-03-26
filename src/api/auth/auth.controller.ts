import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterRequestDto from './dto/register.request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '@common/auth/guards/jwt.guard';
import { AuthGuard } from '@nestjs/passport';

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

  @ApiOperation({ summary: 'Validate jwt token' })
  @UseGuards(AuthGuard('jwt'))
  @Get('validate')
  validateToken(@Req() request) {
    return { statusCode: 200, message: 'Token is valid' };
  }
}
