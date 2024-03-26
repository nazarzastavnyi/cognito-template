import { Injectable } from '@nestjs/common';
import { AuthInteractor } from '@api/auth/auth.interactor';

@Injectable()
export class AuthService {
  constructor(private readonly authInteractor: AuthInteractor) {}
}
