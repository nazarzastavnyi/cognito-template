import { QueueGroups, SqsGateway } from '@common/gateways/sqs.gateway';
import { Injectable } from '@nestjs/common';

export declare enum NotificationTypes {
  EMAIL,
  PUSH,
}
@Injectable()
export class NotificationService {
  constructor(private readonly sqsGateway: SqsGateway) {}
  sendNotification(
    recipients: number[],
    text: string,
    types: NotificationTypes[],
  ) {
    return this.sqsGateway.sendMessage(
      {
        recipients: recipients,
        types: types,
        text: text,
      },
      QueueGroups.NOTIFICATION,
    );
  }
}
