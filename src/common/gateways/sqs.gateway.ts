import {
  SendMessageCommand,
  SendMessageRequest,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Injectable } from '@nestjs/common';

export enum QueueGroups {
  NOTIFICATION = 'notification',
}

@Injectable()
export class SqsGateway {
  private sqsClient: SQSClient;
  private queueUrl: string;
  controller() {
    this.sqsClient = new SQSClient({ region: process.env.AWS_REGION });
    this.queueUrl = process.env.NOTIFICATION_QUEUE_URL;
  }
  async sendMessage(messageBody: any, group: QueueGroups) {
    const params: SendMessageRequest = {
      MessageBody: JSON.stringify(messageBody),
      QueueUrl: this.queueUrl,
      MessageGroupId: group,
      DelaySeconds: 0,
    };
    return this.sqsClient.send(new SendMessageCommand(params)).catch((err) => {
      throw err;
    });
  }
}
