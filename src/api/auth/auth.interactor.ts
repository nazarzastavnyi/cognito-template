import { Injectable } from '@nestjs/common';
import { IUserRegistrationGateway } from '@common/gateways/interfaces/i-user-registration.gateway';
import { IRegisterCommand } from '@api/auth/interfaces/i-register.command';

@Injectable()
export class AuthInteractor {
  constructor(
    private readonly userRegistrationGateway: IUserRegistrationGateway,
  ) {}

  async register(registerCommand: IRegisterCommand) {
    const email = registerCommand.getEmail();
    await this.userRegistrationGateway.register(email);
  }
}
