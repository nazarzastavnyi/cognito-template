import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRegistrationGateway,
  UserRegistrationGatewayType,
} from '@common/gateways/interfaces/i-user-registration.gateway';
import { IRegisterCommand } from '@api/auth/interfaces/i-register.command';
import { LoginRequestDto } from './dto/login.request.dto';
import { LoginResponseDto } from './dto/login.response.dto';

@Injectable()
export class AuthInteractor {
  constructor(
    @Inject(UserRegistrationGatewayType)
    private readonly userRegistrationGateway: IUserRegistrationGateway,
  ) {}

  async register(registerCommand: IRegisterCommand) {
    const email = registerCommand.getEmail();
    await this.userRegistrationGateway.register(email);
  }

  async replaceTemporaryPassword(
    replaceRequest: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    return await this.userRegistrationGateway.replaceTemporaryPassword(
      replaceRequest,
    );
  }

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    return await this.userRegistrationGateway.login(loginRequest);
  }

  async logout(accessToken: string): Promise<void> {
    return await this.userRegistrationGateway.logout(accessToken);
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    return await this.userRegistrationGateway.revokeRefreshToken(refreshToken);
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    return await this.userRegistrationGateway.resetPassword(email, newPassword);
  }

  async initiateForgotPassword(email: string): Promise<void> {
    return await this.userRegistrationGateway.initiateForgotPassword(email);
  }

  async confirmForgotPassword(
    email: string,
    newPassword: string,
    code: string,
  ): Promise<void> {
    return await this.userRegistrationGateway.confirmForgotPassword(
      email,
      newPassword,
      code,
    );
  }
}
