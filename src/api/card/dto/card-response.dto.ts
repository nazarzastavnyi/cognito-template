import { ApiProperty } from '@nestjs/swagger';

export class CardResponseDto {
  @ApiProperty({ example: 'card1', description: 'Unique identifier for the card' })
  cardId: string;

  @ApiProperty({ example: 'John Doe', description: 'Cardholder name' })
  name: string;

  @ApiProperty({ example: 'Visa', description: 'Card brand' })
  brand: string;

  @ApiProperty({ example: '12', description: 'Expiration month' })
  expMonth: string;

  @ApiProperty({ example: '2025', description: 'Expiration year' })
  expYear: string;

}
