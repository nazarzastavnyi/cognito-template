import {
  SendMessageCommand,
  SendMessageRequest,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';
import { INotificationGateway } from '@common/gateways/interfaces/i-notification.gateway';

export enum QueueGroups {
  NOTIFICATION = 'notification',
}

@Injectable()
export class SqsGateway implements INotificationGateway {
  private sqsClient: SQSClient;
  private queueUrl: string;
  controller() {
    this.sqsClient = new SQSClient({ region: process.env.AWS_REGION });
    this.queueUrl = process.env.NOTIFICATION_QUEUE_URL;
  }

  private async sendMessage(messageBody: any, group: QueueGroups) {
    const params: SendMessageRequest = {
      MessageBody: JSON.stringify(messageBody),
      QueueUrl: this.queueUrl,
      MessageGroupId: group,
      DelaySeconds: 0,
    };
    /*return this.sqsClient.send(new SendMessageCommand(params)).catch((err) => {
      throw err;
    });*/
  }

  async sendNotificationMessage(messageBody: any): Promise<boolean> {
    await this.sendMessage(messageBody, QueueGroups.NOTIFICATION);
    return true;
  }
}
