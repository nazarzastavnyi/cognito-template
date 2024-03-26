import { UserType } from '@aws-sdk/client-cognito-identity-provider';
import { LoginResponseDto } from '../../../api/auth/dto/login.response.dto';
import { LoginRequestDto } from '../../../api/auth/dto/login.request.dto';

export interface IUserRegistrationGateway {
  register(email: string): Promise<UserType>;
  replaceTemporaryPassword(
    replaceRequest: LoginRequestDto,
  ): Promise<LoginResponseDto>;
  login(loginRequest: LoginRequestDto): Promise<LoginResponseDto>;
  logout(accessToken: string): Promise<void>;
  revokeRefreshToken(refreshToken: string): Promise<void>;
  resetPassword(email: string, newPassword: string): Promise<void>;
  initiateForgotPassword(email: string): Promise<void>;
  confirmForgotPassword(
    email: string,
    newPassword: string,
    code: string,
  ): Promise<void>;
}

export const UserRegistrationGatewayType = Symbol('IUserRegistrationGateway');
