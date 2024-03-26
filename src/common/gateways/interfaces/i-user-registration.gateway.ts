import { UserType } from '@aws-sdk/client-cognito-identity-provider';

export interface IUserRegistrationGateway {
  register(email: string): Promise<UserType>;
  login(loginRequest: any): Promise<any>;
}

export const UserRegistrationGatewayType = Symbol('IUserRegistrationGateway');
