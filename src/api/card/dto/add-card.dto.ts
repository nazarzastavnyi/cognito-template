import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MetadataDto {
  @ApiProperty({ example: '127.0.0.1', description: 'IP address of the user' })
  @IsString()
  @IsNotEmpty()
  ipAddress: string;

  @ApiProperty({ example: 'Mozilla/5.0...', description: 'User agent string of the user' })
  @IsString()
  @IsNotEmpty()
  userAgent: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email of the user' })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'bec7fcb4-15ce-4bd5-91ab-567d2d8092a7', description: 'Session Id' })
  @IsString()
  @IsNotEmpty()
  sessionId: string;
}

export class BillingDetailsDto {
  @ApiProperty({ example: 'John Doe', description: 'Name on the card' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'San Francisco', description: 'Billing city' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ example: 'US', description: 'Billing country code' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ example: '123 Market St', description: 'Billing street address' })
  @IsString()
  @IsNotEmpty()
  line1: string;

  @ApiProperty({ example: 'CA', description: 'Billing district/state' })
  @IsString()
  @IsNotEmpty()
  district: string;

  @ApiProperty({ example: '94103', description: 'Billing postal code' })
  @IsString()
  @IsNotEmpty()
  postalCode: string;
}

export class AddCardDto {
  @ApiProperty({ example: '378282246310005', description: 'Credit card number - it will be encrypyed on client' })
  @IsString()
  @IsNotEmpty()
  card: string;

  @ApiProperty({ example: '234', description: 'CVV - it will be encrypyed on client' })
  @IsString()
  @IsNotEmpty()
  cvv: string;

  @ApiProperty({ description: 'Billing details for the card', type: () => BillingDetailsDto })
  @ValidateNested()
  @Type(() => BillingDetailsDto)
  @IsObject()
  @IsNotEmpty()
  billingDetails: BillingDetailsDto;

  @ApiProperty({ description: 'Metadata containing IP and user agent', type: () => MetadataDto })
  @ValidateNested()
  @Type(() => MetadataDto)
  @IsObject()
  @IsNotEmpty()
  metadata: MetadataDto;

  @ApiProperty({ example: 'key1', description: 'Circle public key ID' })
  @IsString()
  @IsNotEmpty()
  keyId: string;

  @ApiProperty({ example: '12', description: 'Expiration month of the card' })
  @IsString()
  @IsNotEmpty()
  expMonth: string;

  @ApiProperty({ example: '2025', description: 'Expiration year of the card' })
  @IsString()
  @IsNotEmpty()
  expYear: string;
}
