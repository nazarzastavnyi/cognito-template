import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import RegisterRequestDto from './dto/register.request.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import JwtAuthenticationGuard from '@common/auth/guards/jwt.guard';
import { RegisterCommand } from '@api/auth/dto/register.command';
import { AuthInteractor } from '@api/auth/auth.interactor';
import { LoginRequestDto } from './dto/login.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';

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

  @ApiOperation({ summary: 'Replace temporary password.' })
  @ApiTags('user')
  @Post('password')
  async replaceTemporaryPassword(
    @Body() replaceRequest: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.replaceTemporaryPassword(replaceRequest);
  }

  @ApiOperation({ summary: 'Login user.' })
  @ApiTags('user')
  @Post('login')
  async login(
    @Body() loginRequest: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.authService.login(loginRequest);
  }

  @ApiOperation({ summary: 'Validate jwt token' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  @Get('validate')
  validateToken(@Req() request) {
    return { statusCode: 200, message: 'Token is valid' };
  }
}
