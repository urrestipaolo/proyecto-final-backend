import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EstadoOrdenEnum } from '../generated/prisma/enums.js';

@Injectable()
export class PagosService {
  private readonly mockPayApiUrl = 'https://api.mockpay.sandbox/v1/checkout/sessions';

  constructor(private readonly prisma: PrismaService) {}

  async crearIntencionPago(ventaOrdenId: number) {
    const orden = await this.prisma.ventaOrden.findUnique({
      where: { id: ventaOrdenId },
    });

    if (!orden) {
      throw new NotFoundException(`La orden #${ventaOrdenId} no existe`);
    }

    if (orden.estado === EstadoOrdenEnum.PAGADO) {
      throw new BadRequestException(`La orden #${ventaOrdenId} ya se encuentra pagada`);
    }

    const mockPaySessionId = `mock_sess_${Date.now()}_${orden.id}`;
    const checkoutUrl = `https://checkout.mockpay.sandbox/pay/${mockPaySessionId}?ordenId=${orden.id}&monto=${orden.total}`;

    return {
      statusCode: 200,
      message: 'Intención de pago creada exitosamente',
      paymentId: mockPaySessionId,
      pagoUrl: checkoutUrl,
      monto: orden.total,
      ordenId: orden.id,
    };
  }

  async procesarNotificacionWebhook(payload: any) {
    if (!payload || Object.keys(payload).length === 0) {
      throw new BadRequestException('El payload del webhook no contiene información');
    }

    const targetId = Number(
      payload?.ventaOrdenId ||
      payload?.metadata?.ventaOrdenId ||
      payload?.referenceId ||
      payload?.ventaId,
    );

    const estado = payload?.status || payload?.estadoPago || payload?.event;

    if (!targetId || isNaN(targetId)) {
      throw new BadRequestException('No se pudo identificar el ID de la orden en el payload');
    }

    const tarjeta = payload?.card || payload?.paymentMethodDetails?.card;
    const ultimosDigitos = tarjeta?.last4 || '4242';
    const titular = tarjeta?.holderName || payload?.nombreTitular || 'Titular MockPay';

    const estadosExitosos = ['succeeded', 'PAID', 'COMPLETADO', 'PAGADO', 'payment_intent.succeeded'];

    if (estadosExitosos.includes(estado)) {
      await this.prisma.ventaOrden.update({
        where: { id: targetId },
        data: { estado: EstadoOrdenEnum.PAGADO },
      });

      return {
        status: 'success',
        message: `Pago procesado exitosamente con tarjeta **** ${ultimosDigitos}`,
        ordenId: targetId,
        estadoOrden: EstadoOrdenEnum.PAGADO,
        detallesTransaccion: {
          titular,
          ultimos4Digitos: ultimosDigitos,
          transaccionId: payload?.paymentId || payload?.id || `txn_${Date.now()}`,
        },
      };
    }

    return {
      status: 'failed',
      message: `El pago fue rechazado o está pendiente (Estado: ${estado})`,
      ordenId: targetId,
    };
  }
}