import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class WalletService {
  private readonly CIRCLE_API_URL = process.env.CIRCLE_API_URL;
  private readonly CIRCLE_API_KEY = process.env.CIRCLE_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async getWallet(walletId: string) {
    try {
      const response = await this.httpService
        .get(`${this.CIRCLE_API_URL}/wallets/${walletId}`, {
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
}
