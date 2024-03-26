import { Module } from '@nestjs/common';
import { SqsGateway } from '@common/gateways/sqs.gateway';
import { NotificationService } from '@api/notification/notification.service';
import { NotificationController } from '@api/notification/notification.controller';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, SqsGateway],
})
export class NotificationModule {}
