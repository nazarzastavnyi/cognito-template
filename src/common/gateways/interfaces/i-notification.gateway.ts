export interface INotificationGateway {
  sendNotificationMessage(messageBody: any): Promise<boolean>;
}
export const INotificationGateway = Symbol('INotificationGateway');
