import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsNumberString, IsOptional, IsUUID, ValidateNested, IsObject} from 'class-validator';
import { Type } from 'class-transformer';

export class SourceDto {
  @ApiProperty({
    description: 'The ID of the payment source, e.g., card ID.',
    example: '6d199ccc-40dd-45bd-a29f-0a1907a234c0',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'The type of payment source, e.g., "card".',
    example: 'card',
  })
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class AmountDto {
  @ApiProperty({
    description: 'Payment amount as a string.',
    example: '3.14',
  })
  @IsNumberString()
  amount: string;

  @ApiProperty({
    description: 'Currency for the transaction.',
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;
}

export class MetadataDto {
  @ApiProperty({
    description: 'User email for fraud prevention purposes.',
    example: 'satoshi@circle.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Unique session ID for the user’s current session.',
    example: 'DE6FA86F60BB47B379307F851E238617',
  })
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @ApiProperty({
    description: 'User’s IP address.',
    example: '244.28.239.130',
  })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;
}

export class CreatePaymentDto {
  @ApiProperty({ description: 'Metadata', type: () => MetadataDto })
  @ValidateNested()
  @Type(() => MetadataDto)
  @IsObject()
  @IsNotEmpty()
  metadata: MetadataDto; 

  @ApiProperty({ description: 'Amount', type: () => AmountDto })
  @ValidateNested()
  @Type(() => AmountDto)
  @IsObject()
  @IsNotEmpty()
  amount: AmountDto; 

  @ApiProperty({ description: 'Source of card', type: () => SourceDto })
  @ValidateNested()
  @Type(() => SourceDto)
  @IsObject()
  @IsNotEmpty()
  source: SourceDto; 

  @ApiProperty({
    description: '3D Secure verification type, e.g., "three_d_secure".',
    example: 'none',
  })
  @IsString()
  @IsNotEmpty()
  verification: string;

  @ApiProperty({
    description: 'A description for the payment.',
    example: 'Payment',
  })
  @IsString()
  @IsOptional()
  description?: string;
}
