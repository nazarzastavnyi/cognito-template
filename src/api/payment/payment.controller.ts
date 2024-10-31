import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payment.service';
import { AddCardDto } from './dto/add-card.dto';
import { UsdToUsdcDto } from './dto/usd-to-usdc.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('add-card')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add a credit card' })
  @ApiResponse({ status: 201, description: 'Card added successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async addCard(@Body() addCardDto: AddCardDto) {
    return this.paymentsService.addCard(addCardDto);
  }

  @Post('usd-to-usdc')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Convert USD to USDC using a credit card' })
  @ApiResponse({ status: 200, description: 'Conversion successful' })
  @ApiResponse({ status: 400, description: 'Invalid input or conversion failed' })
  async usdToUsdc(@Body() usdToUsdcDto: UsdToUsdcDto) {
    return this.paymentsService.usdToUsdc(usdToUsdcDto);
  }
}
