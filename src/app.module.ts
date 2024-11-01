import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CardModule } from '@src/api/card/card.module';
import { PaymentsModule } from '@api/payment/payment.module';
import { WalletModule } from '@api/wallet/wallet.module';
import { AuthModule } from '@api/auth/auth.module';

@Module({
  imports: [AuthModule, CardModule, PaymentsModule, WalletModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
