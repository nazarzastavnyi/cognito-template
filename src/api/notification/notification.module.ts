import { Module } from '@nestjs/common';
import { SqsGateway } from '@common/gateways/sqs.gateway';
import { NotificationService } from '@api/notification/notification.service';
import { NotificationController } from '@api/notification/notification.controller';
import { INotificationGateway } from '@common/gateways/interfaces/i-notification.gateway';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: INotificationGateway,
      useClass: SqsGateway,
    },
  ],
})
export class NotificationModule {}
