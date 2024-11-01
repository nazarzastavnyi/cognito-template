import { Controller, Param, HttpException, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { WalletService } from './wallet.service';

@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Retrieve details of wallet' })
  @ApiParam({ name: 'walletId', description: 'Unique identifier for the wallet' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @Get(':walletId')
  async getPayment(@Param('walletId') walletId: string) {
    try {
      return await this.walletService.getWallet(walletId);
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
