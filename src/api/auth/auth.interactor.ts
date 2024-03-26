import { Inject, Injectable } from '@nestjs/common';
import {
  IUserRegistrationGateway,
  UserRegistrationGatewayType,
} from '@common/gateways/interfaces/i-user-registration.gateway';
import { IRegisterCommand } from '@api/auth/interfaces/i-register.command';

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
}
