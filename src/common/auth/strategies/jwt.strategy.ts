import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { passportJwtSecret } from 'jwks-rsa';
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
  GetUserCommandOutput,
} from '@aws-sdk/client-cognito-identity-provider';
import { ValidationException } from '@common/exceptions/validation.exception';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 3,
        jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
      }),

      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}`,
      algorithms: ['RS256'],
    });
  }

  public async validate(payload: any) {
    if (!payload) {
      return null;
    }
    if (!payload.sub) {
      throw new ValidationException('JwtStrategy::validate no sub in jwt');
    }
    //const user = await this.userService.getUserBySub(payload.sub); Get user from db by sub
    if (user === null) {
      throw new ValidationException('JwtStrategy::validate cant find jwt user');
    }

    return {
      sub: payload.sub,
      userPool: payload.iss.split('/').pop(),
      user: user,
    };
  }
}
