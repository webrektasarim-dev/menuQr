import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'CafeQR API - Multi-tenant QR Menu System',
      version: '1.0.0',
      docs: '/api/docs',
    };
  }
}

