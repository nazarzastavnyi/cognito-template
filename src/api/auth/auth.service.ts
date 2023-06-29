import { Injectable } from '@nestjs/common';
import RegisterRequestDto from './dto/register.request.dto';
import CognitoGateway from '@common/gateways/cognito.gateway';
@Injectable()
export class AuthService {
  constructor(private readonly cognitoGateway: CognitoGateway) {}

  async register(authRegisterRequest: RegisterRequestDto) {
    const { email } = authRegisterRequest;
    await this.cognitoGateway.register(email);
  }
}
