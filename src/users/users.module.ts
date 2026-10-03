import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersController } from './users.controller.js';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Exportamos para reusar en AuthModule
})
export class UsersModule {}
