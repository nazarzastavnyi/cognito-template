import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminCreateUserCommandInput,
  AdminCreateUserCommandOutput,
  UserType,
  AdminInitiateAuthCommandInput,
  AdminInitiateAuthCommandOutput,
  AdminInitiateAuthCommand,
  RespondToAuthChallengeCommandOutput,
  RespondToAuthChallengeCommandInput,
  RespondToAuthChallengeCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { IUserRegistrationGateway } from '@common/gateways/interfaces/i-user-registration.gateway';
import * as crypto from 'crypto';
import { LoginRequestDto } from '../../api/auth/dto/login.request.dto';
import { LoginResponseDto } from '../../api/auth/dto/login.response.dto';

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

      return result.User;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async replaceTemporaryPassword(
    replaceRequest: LoginRequestDto,
  ): Promise<LoginResponseDto> {
    const { email, password } = replaceRequest;
    const secretHash = this.generateSecretHash(email);

    const authParams: AdminInitiateAuthCommandInput = {
      UserPoolId: this.userPoolId,
      AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };
    const authResult: AdminInitiateAuthCommandOutput = await this.client.send<
      AdminInitiateAuthCommandInput,
      AdminInitiateAuthCommandOutput
    >(new AdminInitiateAuthCommand(authParams));

    if (authResult.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      const response = await this.respondToNewPasswordChallenge(
        email,
        password,
        secretHash,
        authResult.Session,
      );
      console.log('Login successful after responding to challenge.');
      const { AccessToken, ExpiresIn, RefreshToken } =
        response.AuthenticationResult;
      return {
        accessToken: AccessToken,
        expiresIn: ExpiresIn,
        refreshToken: RefreshToken,
      };
    }
    throw new BadRequestException('Password is not temporary.');
  }

  async login(loginRequest: LoginRequestDto): Promise<LoginResponseDto> {
    try {
      const { email, password } = loginRequest;
      const secretHash = this.generateSecretHash(email);

      const authParams: AdminInitiateAuthCommandInput = {
        UserPoolId: this.userPoolId,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        ClientId: this.clientId,
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
          SECRET_HASH: secretHash,
        },
      };
      const authResult: AdminInitiateAuthCommandOutput = await this.client.send<
        AdminInitiateAuthCommandInput,
        AdminInitiateAuthCommandOutput
      >(new AdminInitiateAuthCommand(authParams));

      if (authResult.AuthenticationResult) {
        console.log('Login successful.');
        const { AccessToken, ExpiresIn, RefreshToken } =
          authResult.AuthenticationResult;
        return {
          accessToken: AccessToken,
          expiresIn: ExpiresIn,
          refreshToken: RefreshToken,
        };
      }
      throw new Error(authResult.ChallengeName);
    } catch (error) {
      throw new HttpException(
        `Login failed: ${error.message}`,
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private async respondToNewPasswordChallenge(
    email: string,
    newPassword: string,
    secretHash: string,
    session: string,
  ): Promise<RespondToAuthChallengeCommandOutput> {
    const challengeParams: RespondToAuthChallengeCommandInput = {
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ClientId: this.clientId,
      ChallengeResponses: {
        USERNAME: email,
        NEW_PASSWORD: newPassword,
        SECRET_HASH: secretHash,
      },
      Session: session,
    };

    return await this.client.send(
      new RespondToAuthChallengeCommand(challengeParams),
    );
  }

  private generateSecretHash(username: string): string {
    return crypto
      .createHmac('sha256', this.clientSecret)
      .update(`${username}${this.clientId}`)
      .digest('base64');
  }
}

export default CognitoGateway;
