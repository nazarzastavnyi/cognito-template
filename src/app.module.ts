import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PaymentsModule } from '@api/payment/payment.module';
import { AuthModule } from '@api/auth/auth.module';

@Module({
  imports: [AuthModule, PaymentsModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
