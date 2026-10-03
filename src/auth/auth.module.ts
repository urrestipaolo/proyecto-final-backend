import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy.js';

@Global()
@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
     JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'la-super-duper-mega-secreta-contrasena-del-mundo',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard, JwtStrategy],
  exports: [AuthService, JwtAuthGuard, RolesGuard, JwtModule, PassportModule],
})
export class AuthModule {}
