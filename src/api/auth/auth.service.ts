import { Injectable } from '@nestjs/common';
import RegisterRequestDto from './dto/register.request.dto';
import CognitoGateway from '@common/gateways/cognito.gateway';
import { JwtService } from '@nestjs/jwt';
import { AuthException } from '@common/exceptions';

@Injectable()
export class AuthService {
  constructor(
    private readonly cognitoGateway: CognitoGateway,
    private jwtService: JwtService,
  ) {}

  async validateToken(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      throw new AuthException('Token verification failed');
    }
  }

  async register(authRegisterRequest: RegisterRequestDto) {
    const { email } = authRegisterRequest;
    await this.cognitoGateway.register(email);
  }
}
