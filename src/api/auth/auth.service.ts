import { Injectable } from '@nestjs/common';
import RegisterRequestDto from './dto/register.request.dto';
import CognitoGateway from '@common/gateways/cognito.gateway';
import SignInRequestDto from './dto/sign.in.request.dto';
import SignOutRequestDto from './dto/sign.out.request.dto';
@Injectable()
export class AuthService {
  constructor(private readonly cognitoGateway: CognitoGateway) {}

  async register(authRegisterRequest: RegisterRequestDto) {
    const { email } = authRegisterRequest;
    await this.cognitoGateway.register(email);
  }

  async signIn(signInRequest: SignInRequestDto) {
    const { email, password } = signInRequest;
    await this.cognitoGateway.signIn(email, password);
  }

  async signOut(signOutRequest: SignOutRequestDto) {
    const { email } = signOutRequest;
    await this.cognitoGateway.signOut(email);
  }
}
