import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // Extrae el token del Header 'Authorization: Bearer <token>'
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'la-super-duper-mega-secreta-contrasena-del-mundo',
    });
  }

  // Se ejecuta automáticamente si el token es válido
  async validate(payload: any) {
    if (!payload) {
      throw new UnauthorizedException('Token inválido');
    }

    // Retorna el usuario autenticado que se adjuntará a request.user
    return {
      userId: payload.sub || payload.id,
      email: payload.email,
      rol: payload.rol || payload.role, // Necesario para que RolesGuard verifique el rol ADMIN
    };
  }
}