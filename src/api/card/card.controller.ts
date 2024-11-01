import { Controller, Post, Body, HttpCode, HttpStatus, HttpException, Get, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CardService } from './card.service';
import { AddCardDto } from './dto/add-card.dto';
import { CardResponseDto } from './dto/card-response.dto';

@ApiTags('Card')
@Controller('card')
export class CardController {
  constructor(private readonly CardService: CardService) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a credit card' })
  @ApiResponse({ status: 201, description: 'Card added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async addCard(@Body() addCardDto: AddCardDto) {
    return this.CardService.addCard(addCardDto);
  }

  @ApiOperation({ summary: 'Retrieve details of a specific card' })
  @ApiParam({ name: 'cardId', description: 'Unique identifier for the card' })
  @ApiResponse({ status: 200, description: 'Card retrieved successfully', type: CardResponseDto })
  @ApiResponse({ status: 404, description: 'Card not found' })
  @Get(':cardId')
  async getCard(@Param('cardId') cardId: string) {
    try {
      return await this.CardService.getCard(cardId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @ApiOperation({ summary: 'List all stored cards' })
  @ApiResponse({ status: 200, description: 'List of all cards', type: [CardResponseDto] })
  @Get()
  async listCards() {
    try {
      return await this.CardService.listCards();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
