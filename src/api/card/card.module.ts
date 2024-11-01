import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CardService } from './card.service';
import { CardController } from './card.controller';

@Module({
  imports: [HttpModule],
  providers: [CardService],
  controllers: [CardController],
})
export class CardModule {}
