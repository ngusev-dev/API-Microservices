import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      message: 'Welcome to API Service',
    };
  }

  public health() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
}
