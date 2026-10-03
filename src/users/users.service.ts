import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, passwordHash, rolId, nombre, telefono } = createUserDto;

    // 1. Verificar si el usuario ya existe por email
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      throw new ConflictException(`El correo ${email} ya está registrado`);
    }

    // 2. Hashear la contraseña
    const hashedPassword = await bcrypt.hash(passwordHash, 10);

    // 3. Crear el usuario pasando rolId directamente (UncheckedCreateInput)
    try {
      return await this.prisma.usuario.create({
        data: {
          email: createUserDto.email,
          passwordHash: hashedPassword,
          nombre: createUserDto.nombre,
          telefono: createUserDto.telefono,
          rolId: rolId ?? 1,
        },
        select: {
          id: true,
          email: true,
          nombre: true,
          telefono: true,
          rolId: true,
          creadoEn: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Error al crear el usuario. Verifica los campos enviados.');
    }
  }

  async findAll() {
    return this.prisma.usuario.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        telefono: true,
        rolId: true,
        creadoEn: true,
      },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nombre: true,
        telefono: true,
        rolId: true,
        creadoEn: true,
      },
    });

    if (!usuario) {
      throw new BadRequestException(`El usuario con ID ${id} no fue encontrado`);
    }

    return usuario;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Validar existencia

    const { passwordHash, ...restoDatos } = updateUserDto;
    let dataToUpdate: any = { ...restoDatos };

    if (passwordHash) {
      dataToUpdate.passwordHash = await bcrypt.hash(passwordHash, 10);
    }

    return this.prisma.usuario.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        email: true,
        nombre: true,
        telefono: true,
        rolId: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Validar existencia
    return this.prisma.usuario.delete({
      where: { id },
    });
  }

  
  async findByEmail(email: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: {
        rol: true, // Incluye los datos del rol asociado
      },
    });

    if (!usuario) {
      throw new NotFoundException(`No se encontró un usuario registrado con el correo ${email}`);
    }

    return usuario;
  }
}

