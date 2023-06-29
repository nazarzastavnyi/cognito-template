import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import CognitoGateway from '@common/gateways/cognito.gateway';

@Module({
  imports: [ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, CognitoGateway],
})
export class AuthModule {}
