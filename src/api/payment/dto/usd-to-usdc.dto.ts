import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumberString } from 'class-validator';

export class UsdToUsdcDto {
  @ApiProperty({ example: '100', description: 'Amount in USD to convert' })
  @IsNumberString()
  @IsNotEmpty()
  amount: string;

  @ApiProperty({ example: 'card_id_123456', description: 'ID of the card to charge' })
  @IsString()
  @IsNotEmpty()
  cardId: string;
}