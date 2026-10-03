import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ConfigModule } from '@nestjs/config';
import { envValidationSchema } from './config/env.validation.js';

import { RolesModule } from './roles/roles.module.js';
import { CategoriasModule } from './categorias/categoria.module.js';
import { UsersModule } from './users/users.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ProductosModule } from './productos/productos.module.js';
import { VentasModule } from './ventas/ventas.module.js';
import { DireccionesModule } from './direcciones/direccion.module.js';
import { CajasModule } from './cajas/caja.module.js';
import { CarritosModule } from './carritos/carrito.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        libraryOptions: {
          abortEarly: false,
          allowUnknown: true,
        },
      },
    }),
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'first-app',
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    RolesModule,
    CategoriasModule,
    ProductosModule,
    VentasModule,
    DireccionesModule,
    CajasModule,
    CarritosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
