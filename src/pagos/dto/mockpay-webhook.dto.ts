import { IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

// Con forbidNonWhitelisted: true en main.ts, el DTO debe declarar TODOS los
// campos que envía MockPay, o Nest rechazará el webhook con 400.
export class MockpayWebhookDto {
  @IsString()
  event: string; // payment.succeeded | payment.failed

  @IsString()
  id: string;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;

  @IsString()
  status: string; // SUCCEEDED | FAILED

  @IsOptional()
  @IsString()
  failure_reason?: string | null; // insufficient_funds | card_declined

  @IsObject()
  metadata: Record<string, any>;

  @IsOptional()
  @IsString()
  created_at?: string;
}