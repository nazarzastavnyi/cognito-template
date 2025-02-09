import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import CognitoGateway from '@common/gateways/cognito.gateway';
import { JwtStrategy } from '@common/auth/strategies/jwt.strategy';
import { UserRegistrationGatewayType } from '@common/gateways/interfaces/i-user-registration.gateway';
import { AuthInteractor } from '@api/auth/auth.interactor';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secretKey', // replace with reference to real secret
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    JwtStrategy,
    AuthInteractor,
    {
      provide: UserRegistrationGatewayType,
      useClass: CognitoGateway,
    },
  ],
})
export class AuthModule {}
