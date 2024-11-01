import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AddCardDto } from './dto/add-card.dto';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { createMessage, encrypt, readKey } from 'openpgp';


@Injectable()
export class CardService {
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

  async getCard(cardId: string) {
    try {
      const response = await this.httpService
        .get(`${this.CIRCLE_API_URL}/cards/${cardId}`, {
          headers: {
            Authorization: `Bearer ${this.CIRCLE_API_KEY}`,
          },
        })
        .toPromise();

      return response?.data;
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
    }
  }

  async listCards() {
    try {
      const response = await this.httpService
        .get(`${this.CIRCLE_API_URL}/cards`, {
          headers: {
            Authorization: `Bearer ${this.CIRCLE_API_KEY}`,
          },
        })
        .toPromise();

      return response?.data;
    } catch (error) {
      throw new HttpException(error.response.data, error.response.status);
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
