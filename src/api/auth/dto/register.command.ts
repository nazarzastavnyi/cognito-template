import { IRegisterCommand } from '@api/auth/interfaces/i-register.command';

export class RegisterCommand implements IRegisterCommand {
  private readonly email: string;
  constructor(email: string) {
    this.email = email.toLowerCase();
  }

  getEmail(): string {
    return this.email;
  }
}
