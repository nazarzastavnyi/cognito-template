import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AddCardDto } from './dto/add-card.dto';
import { UsdToUsdcDto } from './dto/usd-to-usdc.dto';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { createMessage, encrypt, readKey } from 'openpgp';


@Injectable()
export class PaymentsService {
  private readonly CIRCLE_API_URL = process.env.CIRCLE_API_URL;
  private readonly CIRCLE_API_KEY = process.env.CIRCLE_API_KEY;
  private readonly CIRCLE_PUBLIC_KEY = process.env.CIRCLE_PUBLIC_KEY;

  constructor(private readonly httpService: HttpService) {}

  async addCard(addCardDto: AddCardDto) {
    try {
      const url = `${this.CIRCLE_API_URL}/cards`;
      const headers = {
        Authorization: `Bearer ${this.CIRCLE_API_KEY}`,
        'Content-Type': 'application/json',
      };

      const body = {
        idempotencyKey: uuidv4(),
        keyId: addCardDto.keyId,
        encryptedData: await this.encryptCardData(addCardDto.card, addCardDto.cvv, this.CIRCLE_PUBLIC_KEY),
        billingDetails: addCardDto.billingDetails,
        expMonth: addCardDto.expMonth,
        expYear: addCardDto.expYear,
        metadata: addCardDto.metadata,
      };
      console.log(body);

      const { data } = await firstValueFrom(
        this.httpService.post(url, body, { headers }),
      );

      return data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Could not add card',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async usdToUsdc(usdToUsdcDto: UsdToUsdcDto) {
    try {
      const url = `${this.CIRCLE_API_URL}/payments`;
      const headers = {
        Authorization: `Bearer ${this.CIRCLE_API_KEY}`,
        'Content-Type': 'application/json',
      };

      const body = {
        source: {
          type: 'card',
          id: usdToUsdcDto.cardId,
        },
        amount: {
          currency: 'USD',
          amount: usdToUsdcDto.amount,
        },
        settlementCurrency: 'USDC',
      };

      const { data } = await firstValueFrom(
        this.httpService.post(url, body, { headers }),
      );

      return data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Could not convert USD to USDC',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async encryptCardData(cardNumber: string, cvv: string, publicKeyArmored: string) {
    const data = {
        number: cardNumber,
        cvv: cvv
      };

    const publicKey = await readKey({ armoredKey: atob(publicKeyArmored) });

    const message = await createMessage({ text: JSON.stringify(data) });

    const encrypted = await encrypt({
        message,
        encryptionKeys: publicKey,
    });

    return Buffer.from(encrypted.toString()).toString('base64');
  }
}
