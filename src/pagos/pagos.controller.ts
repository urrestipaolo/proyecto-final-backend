import { Controller, Post, Body, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { PagosService } from './pagos.service.js';

@Controller('pagos')
export class PagosController {
  constructor(private readonly pagosService: PagosService) {}

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async recibirWebhook(@Body() payload: any) {
    console.log('Notificación recibida en Webhook:', payload);

    if (!payload || Object.keys(payload).length === 0) {
      throw new BadRequestException('El payload del webhook no puede estar vacío');
    }

    return await this.pagosService.procesarNotificacionWebhook(payload);
  }
}