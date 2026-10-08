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
      secretOrKey: configService.getOrThrow('JWT_SECRET')
    });
  }

  // Se ejecuta automáticamente si el token es válido
  async validate(payload: any) {
    if (!payload) throw new UnauthorizedException('Token inválido');
    return {
    userId: payload.sub || payload.id,
    email: payload.email,
    role: payload.role,
    };
  }
}