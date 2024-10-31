import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PaymentsService } from './payment.service';
import { PaymentsController } from './payment.controller';

@Module({
  imports: [HttpModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
