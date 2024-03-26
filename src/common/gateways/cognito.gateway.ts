import { Injectable } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
  InitiateAuthCommandInput,
  InitiateAuthCommandOutput,
  InitiateAuthCommand,
  UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { IUserRegistrationGateway } from '@common/gateways/interfaces/i-user-registration.gateway';
import * as crypto from 'crypto';

let testUser = null;

@Injectable()
class CognitoGateway implements IUserRegistrationGateway {
  private readonly client: CognitoIdentityProviderClient;
  private readonly userPoolId: string;
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
    this.userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
    this.clientId = process.env.AWS_COGNITO_CLIENT_ID;
    this.clientSecret = process.env.AWS_COGNITO_CLIENT_SECRET;
  }

  async register(email: string): Promise<UserType> {
    const command = new AdminCreateUserCommand({
      UserPoolId: this.userPoolId,
      DesiredDeliveryMediums: ['EMAIL'],
      Username: email,
      UserAttributes: [
        { Name: 'email', Value: email },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
    });

    try {
      const result = await this.client.send<
        AdminCreateUserCommandInput,
        AdminCreateUserCommandOutput
      >(command);

      testUser = result.User;
      // console.log('🚀 ~ CognitoGateway ~ register ~ testUser:', testUser);

      return result.User;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(loginRequest: any): Promise<any> {
    const { email, password } = loginRequest;
    // console.log('🚀 ~ CognitoGateway ~ login ~ password:', password);
    // console.log('🚀 ~ CognitoGateway ~ login ~ email:', email);
    // console.log(
    //   '🚀 ~ CognitoGateway ~ login ~ testUser.Username:',
    //   testUser.Username,
    // );

    const secretHash = this.generateSecretHash(testUser.Username);
    const authParams: InitiateAuthCommandInput = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };

    try {
      const authResult: InitiateAuthCommandOutput = await this.client.send<
        InitiateAuthCommandInput,
        InitiateAuthCommandOutput
      >(new InitiateAuthCommand(authParams));

      const token = authResult.AuthenticationResult?.IdToken;
      console.log('Login successful. IdToken:', token);

      return token || '';
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Login failed');
    }
  }

  private generateSecretHash(username: string): string {
    const data = username + this.clientId;
    return crypto
      .createHmac('sha256', this.clientSecret)
      .update(data)
      .digest('hex');
  }
}

export default CognitoGateway;
