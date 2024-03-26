import { Injectable } from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
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
}

export default CognitoGateway;
