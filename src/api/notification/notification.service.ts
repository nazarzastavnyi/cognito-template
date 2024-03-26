import { Injectable } from '@nestjs/common';
import { INotificationGateway } from '@common/gateways/interfaces/i-notification.gateway';

export declare enum NotificationTypes {
  EMAIL,
  PUSH,
}
@Injectable()
export class NotificationService {
  constructor(private readonly notificationGateway: INotificationGateway) {}
  sendNotification(
    recipients: number[],
    text: string,
    types: NotificationTypes[],
  ) {
    return this.notificationGateway.sendNotificationMessage({
      recipients: recipients,
      types: types,
      text: text,
    });
  }
}
