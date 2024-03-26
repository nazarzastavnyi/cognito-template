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
  GlobalSignOutCommandInput,
  GlobalSignOutCommand,
  RevokeTokenCommandInput,
  RevokeTokenCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  ConfirmForgotPasswordCommandInput,
  AdminResetUserPasswordCommandInput,
  AdminResetUserPasswordCommandOutput,
  AdminResetUserPasswordCommand,
  AdminSetUserPasswordCommandInput,
  AdminSetUserPasswordCommandOutput,
  AdminSetUserPasswordCommand,
  ConfirmForgotPasswordCommandOutput,
  ForgotPasswordCommandInput,
  ForgotPasswordCommandOutput,
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

  async confirmRegistration(
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
      console.log(
        'Confirm registration successful after responding to challenge.',
      );
      const { AccessToken, ExpiresIn, RefreshToken } =
        response.AuthenticationResult;
      return {
        accessToken: AccessToken,
        expiresIn: ExpiresIn,
        refreshToken: RefreshToken,
      };
    }
    throw new BadRequestException('Confirm registration failed.');
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

  async logout(accessToken: string): Promise<void> {
    try {
      const signOutParams: GlobalSignOutCommandInput = {
        AccessToken: accessToken,
      };

      await this.client.send(new GlobalSignOutCommand(signOutParams));

      console.log('Logout successful');
    } catch (error) {
      throw new HttpException(
        `Logout failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const revokeParams: RevokeTokenCommandInput = {
      Token: refreshToken,
      ClientId: this.clientId,
      ClientSecret: this.clientSecret,
    };

    try {
      await this.client.send(new RevokeTokenCommand(revokeParams));
      console.log('Token revoked successfully');
    } catch (error) {
      console.error('Token revocation failed:', error);
      throw new Error('Token revocation failed');
    }
  }

  async resetPassword(email: string, newPassword: string): Promise<void> {
    try {
      await this.initiateAdminResetUserPassword(email);
      await this.initiateAdminSetUserPassword(email, newPassword);

      console.log('Password reset completed successfully');
    } catch (error) {
      console.error('Password reset failed:', error.message);
      throw new HttpException(
        `Password reset failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async initiateForgotPassword(email: string): Promise<void> {
    const secretHash = this.generateSecretHash(email);
    try {
      const params = {
        ClientId: this.clientId,
        Username: email,
        SecretHash: secretHash,
      };

      await this.client.send<
        ForgotPasswordCommandInput,
        ForgotPasswordCommandOutput
      >(new ForgotPasswordCommand(params));
      console.log('Forgot password initiated successfully');
    } catch (error) {
      console.error('Forgot password initiation failed:', error.message);
      throw new HttpException(
        `Forgot password initiation failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async confirmForgotPassword(
    email: string,
    newPassword: string,
    confirmationCode: string,
  ): Promise<void> {
    try {
      const secretHash = this.generateSecretHash(email);
      const params: ConfirmForgotPasswordCommandInput = {
        ClientId: this.clientId,
        SecretHash: secretHash,
        Username: email,
        ConfirmationCode: confirmationCode,
        Password: newPassword,
      };

      await this.client.send<
        ConfirmForgotPasswordCommandInput,
        ConfirmForgotPasswordCommandOutput
      >(new ConfirmForgotPasswordCommand(params));

      console.log('Password reset confirmed successfully');
    } catch (error) {
      console.error('Password reset confirmation failed:', error.message);
      throw new HttpException(
        `Password reset confirmation failed: ${error.message}`,
        HttpStatus.BAD_REQUEST,
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

  private async initiateAdminResetUserPassword(email: string): Promise<void> {
    const resetPasswordParams = {
      UserPoolId: this.userPoolId,
      Username: email,
    };

    try {
      await this.client.send<
        AdminResetUserPasswordCommandInput,
        AdminResetUserPasswordCommandOutput
      >(new AdminResetUserPasswordCommand(resetPasswordParams));

      console.log('Password reset initiated successfully');
    } catch (error) {
      console.error('Password reset initiation failed:', error);
      throw error;
    }
  }

  private async initiateAdminSetUserPassword(
    email: string,
    newPassword: string,
  ): Promise<void> {
    const setPasswordParams = {
      UserPoolId: this.userPoolId,
      Username: email,
      Password: newPassword,
      Permanent: true,
    };

    try {
      await this.client.send<
        AdminSetUserPasswordCommandInput,
        AdminSetUserPasswordCommandOutput
      >(new AdminSetUserPasswordCommand(setPasswordParams));

      console.log('Password reset confirmed successfully');
    } catch (error) {
      console.error('Password reset confirmation failed:', error.message);
      throw error;
    }
  }
}

export default CognitoGateway;
