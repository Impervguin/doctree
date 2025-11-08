import { Injectable } from '@nestjs/common';
import axios, { AxiosResponse } from 'axios';

@Injectable()
export class HttpClientService {
  async get<T = any>(url: string): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch from ${url}: ${error.message}`);
    }
  }
}