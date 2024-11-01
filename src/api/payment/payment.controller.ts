import { Controller, Post, Body, HttpCode, HttpStatus, Param, HttpException, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payment.service';
import { CreatePaymentDto } from './dto/payment.dto';

@ApiTags('Payment')
@Controller('payment')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Make payment to circle wallet' })
  @ApiResponse({ status: 200, description: 'Conversion successful' })
  @ApiResponse({ status: 400, description: 'Invalid input or conversion failed' })
  async create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @ApiOperation({ summary: 'Retrieve details of a specific payment' })
  @ApiParam({ name: 'paymentId', description: 'Unique identifier for the payment' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Get(':paymentId')
  async getPayment(@Param('paymentId') paymentId: string) {
    try {
      return await this.paymentsService.getPayment(paymentId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @ApiOperation({ summary: 'List all stored payments' })
  @ApiResponse({ status: 200, description: 'List of all payments' })
  @Get()
  async listPayments() {
    try {
      return await this.paymentsService.getPaymentsList();
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
