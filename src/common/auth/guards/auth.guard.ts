import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CognitoJwtVerifier } from 'aws-jwt-verify';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly userPoolId: string;
  private readonly clientId: string;

  constructor() {
    this.userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
    this.clientId = process.env.AWS_COGNITO_CLIENT_ID;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Bearer token not provided');
    }
    const verifier = CognitoJwtVerifier.create({
      userPoolId: this.userPoolId,
      tokenUse: 'access',
      clientId: this.clientId,
    });

    try {
      const payload = await verifier.verify(token);
      request['decoded'] = payload.sub;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
