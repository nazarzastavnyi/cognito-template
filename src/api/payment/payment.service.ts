import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreatePaymentDto } from './dto/payment.dto';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class PaymentsService {
  private readonly CIRCLE_API_URL = process.env.CIRCLE_API_URL;
  private readonly CIRCLE_API_KEY = process.env.CIRCLE_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const url = `${this.CIRCLE_API_URL}/payments`;
      const headers = {
        Authorization: `Bearer ${this.CIRCLE_API_KEY}`,
        'Content-Type': 'application/json',
      };

      const body = {
        idempotencyKey: uuidv4(),
        ...createPaymentDto,
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

  async getPaymentsList(): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.CIRCLE_API_URL}/payments`, {
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

  async getPayment(paymentId: string) {
    try {
      const response = await this.httpService
        .get(`${this.CIRCLE_API_URL}/payments/${paymentId}`, {
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
