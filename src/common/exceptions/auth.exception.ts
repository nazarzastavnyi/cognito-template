import { CustomException } from './custom.exception';
import { ErrorCodes } from '@common/enum/error-codes.enum';
import { HttpStatus } from '@nestjs/common';

export class AuthException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED, ErrorCodes.AUTH);
  }
}
