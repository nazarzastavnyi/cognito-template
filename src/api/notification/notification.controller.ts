import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import JwtAuthenticationGuard from '@common/auth/guards/jwt.guard';
import {
  NotificationService,
  NotificationTypes,
} from '@api/notification/notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOperation({ summary: 'Send notification to user' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async sendNotification() {
    await this.notificationService.sendNotification([1], 'Test notification', [
      NotificationTypes.PUSH,
      NotificationTypes.EMAIL,
    ]);
  }
}
