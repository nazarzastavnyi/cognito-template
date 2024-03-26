import { Injectable } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
  AdminInitiateAuthCommand,
  AdminInitiateAuthCommandOutput,
  AdminUserGlobalSignOutCommand,
} from '@aws-sdk/client-cognito-identity-provider';

@Injectable()
class CognitoGateway {
  private readonly client: CognitoIdentityProviderClient;
  private readonly userPoolId: string;

  constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
    this.userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
  }

  async register(email: string) {
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

    return this.client
      .send<AdminCreateUserCommandInput, AdminCreateUserCommandOutput>(command)
      .catch((err) => {
        throw new Error(err.message);
      });
  }

  async signIn(email: string, password: string) {
    const command = new AdminInitiateAuthCommand({
      UserPoolId: process.env.USER_POOL_ID || '',
      ClientId: process.env.CLIENT_ID || '',
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    try {
      const { AuthenticationResult } = await this.client.send(command) as AdminInitiateAuthCommandOutput;
      return AuthenticationResult;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async signOut(email: string) {
    const command = new AdminUserGlobalSignOutCommand({
      UserPoolId: process.env.USER_POOL_ID || '',
      Username: email,
    });

    try {
      return await this.client.send(command);
    } catch (err) {
      throw new Error(err.message);
    }
  }
}

export default CognitoGateway;
