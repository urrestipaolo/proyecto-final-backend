/*
  Warnings:

  - You are about to drop the column `creadoEn` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `creadoEn` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `usuarios` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sku]` on the table `productos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoria_id` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio_compra` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio_venta` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sku` to the `productos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombre` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password_hash` to the `usuarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rol_id` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RolEnum" AS ENUM ('ADMIN', 'CAJERO', 'CLIENTE');

-- CreateEnum
CREATE TYPE "TipoOrigenEnum" AS ENUM ('POS', 'WEB');

-- CreateEnum
CREATE TYPE "EstadoOrdenEnum" AS ENUM ('PENDIENTE', 'PAGADO', 'EN_CAMINO', 'ENTREGADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "MetodoPagoEnum" AS ENUM ('EFECTIVO', 'TARJETA', 'TRANSFERENCIA_QR');

-- CreateEnum
CREATE TYPE "EstadoCajaEnum" AS ENUM ('ABIERTA', 'CERRADA');

-- AlterTable
ALTER TABLE "productos" DROP COLUMN "creadoEn",
DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "price",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "categoria_id" INTEGER NOT NULL,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "precio_compra" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "precio_venta" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "sku" TEXT NOT NULL,
ALTER COLUMN "stock" DROP DEFAULT;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "creadoEn",
DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "role",
ADD COLUMN     "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nombre" TEXT NOT NULL,
ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "rol_id" INTEGER NOT NULL,
ADD COLUMN     "telefono" TEXT;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "nombre" "RolEnum" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "direccion_linea" TEXT NOT NULL,
    "referencia" TEXT,
    "ciudad" TEXT NOT NULL,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cajas" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "monto_apertura" DECIMAL(10,2) NOT NULL,
    "monto_cierre" DECIMAL(10,2),
    "fecha_apertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_cierre" TIMESTAMP(3),
    "estado" "EstadoCajaEnum" NOT NULL DEFAULT 'ABIERTA',

    CONSTRAINT "cajas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carritos" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,

    CONSTRAINT "carritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_carrito" (
    "id" SERIAL NOT NULL,
    "carrito_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "detalle_carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ventas_ordenes" (
    "id" SERIAL NOT NULL,
    "usuario_id" INTEGER NOT NULL,
    "caja_id" INTEGER,
    "direccion_id" INTEGER,
    "tipo_origen" "TipoOrigenEnum" NOT NULL,
    "estado" "EstadoOrdenEnum" NOT NULL DEFAULT 'PENDIENTE',
    "metodo_pago" "MetodoPagoEnum" NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "creado_en" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ventas_ordenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "detalle_ventas_ordenes" (
    "id" SERIAL NOT NULL,
    "venta_orden_id" INTEGER NOT NULL,
    "producto_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "detalle_ventas_ordenes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_nombre_key" ON "roles"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_nombre_key" ON "categorias"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "carritos_usuario_id_key" ON "carritos"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "productos_sku_key" ON "productos"("sku");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cajas" ADD CONSTRAINT "cajas_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carritos" ADD CONSTRAINT "carritos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_carrito" ADD CONSTRAINT "detalle_carrito_carrito_id_fkey" FOREIGN KEY ("carrito_id") REFERENCES "carritos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_carrito" ADD CONSTRAINT "detalle_carrito_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas_ordenes" ADD CONSTRAINT "ventas_ordenes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas_ordenes" ADD CONSTRAINT "ventas_ordenes_caja_id_fkey" FOREIGN KEY ("caja_id") REFERENCES "cajas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ventas_ordenes" ADD CONSTRAINT "ventas_ordenes_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "direcciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_ventas_ordenes" ADD CONSTRAINT "detalle_ventas_ordenes_venta_orden_id_fkey" FOREIGN KEY ("venta_orden_id") REFERENCES "ventas_ordenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detalle_ventas_ordenes" ADD CONSTRAINT "detalle_ventas_ordenes_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
