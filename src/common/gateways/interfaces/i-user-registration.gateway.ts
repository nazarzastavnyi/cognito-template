export interface IUserRegistrationGateway {
  register(email: string): Promise<boolean>;
}

export const IUserRegistrationGateway = Symbol('IUserRegistrationGateway');
