import { UserType } from '@aws-sdk/client-cognito-identity-provider';
import { LoginResponseDto } from '../../../api/auth/dto/login.response.dto';
import { LoginRequestDto } from '../../../api/auth/dto/login.request.dto';

export interface IUserRegistrationGateway {
  register(email: string): Promise<UserType>;
  replaceTemporaryPassword(
    replaceRequest: LoginRequestDto,
  ): Promise<LoginResponseDto>;
  login(loginRequest: LoginRequestDto): Promise<LoginResponseDto>;
}

export const UserRegistrationGatewayType = Symbol('IUserRegistrationGateway');
