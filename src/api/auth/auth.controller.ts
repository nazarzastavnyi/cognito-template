import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import RegisterRequestDto from './dto/register.request.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '@common/auth/guards/jwt.guard';
import SignInRequestDto from './dto/sign.in.request.dto';
import SignOutRequestDto from './dto/sign.out.request.dto';

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

  @ApiOperation({ summary: 'Existing user signs in' })
  @ApiTags('user')
  @Post('signIn')
  async signIn(@Body() signInRequest: SignInRequestDto) {
    signInRequest.email = signInRequest.email.toLowerCase();
    await this.authService.signIn(signInRequest);
  }

  @ApiOperation({ summary: 'Existing user signs out' })
  @ApiTags('user')
  @Post('signOut')
  async signOut(@Body() signOutRequest: SignOutRequestDto) {
    signOutRequest.email = signOutRequest.email.toLowerCase();
    await this.authService.signOut(signOutRequest);
  }
}
