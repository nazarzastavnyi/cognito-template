import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from '@api/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
