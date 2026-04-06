/*
  Warnings:

  - You are about to drop the column `couponId` on the `sale` table. All the data in the column will be lost.
  - You are about to drop the column `totalValue` on the `sale` table. All the data in the column will be lost.
  - The `status` column on the `sale` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `sale_item` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `sale_item` table. All the data in the column will be lost.
  - You are about to drop the `sale_payment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[saleId,productId]` on the table `sale_item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `finalPrice` to the `sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `sale` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."payment_type" AS ENUM ('credit_card', 'pix', 'boleto');

-- CreateEnum
CREATE TYPE "public"."payment_status" AS ENUM ('canceled', 'refunded', 'pending', 'paid');

-- CreateEnum
CREATE TYPE "public"."sale_status" AS ENUM ('processing', 'approved', 'shipped', 'delivered', 'canceled');

-- DropForeignKey
ALTER TABLE "public"."sale" DROP CONSTRAINT "sale_couponId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sale_payment" DROP CONSTRAINT "sale_payment_cardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sale_payment" DROP CONSTRAINT "sale_payment_saleId_fkey";

-- AlterTable
ALTER TABLE "public"."sale" DROP COLUMN "couponId",
DROP COLUMN "totalValue",
ADD COLUMN     "finalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "totalPrice" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."sale_status" NOT NULL DEFAULT 'processing';

-- AlterTable
ALTER TABLE "public"."sale_item" DROP CONSTRAINT "sale_item_pkey",
DROP COLUMN "id";

-- DropTable
DROP TABLE "public"."sale_payment";

-- CreateTable
CREATE TABLE "public"."payment" (
    "id" SERIAL NOT NULL,
    "saleId" INTEGER NOT NULL,
    "typePayment" "public"."payment_type" NOT NULL,
    "statusPayment" "public"."payment_status" NOT NULL,
    "cardId" INTEGER,
    "amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sale_coupon" (
    "saleId" INTEGER NOT NULL,
    "couponId" INTEGER NOT NULL,
    "type" "public"."coupon_type" NOT NULL,
    "discount" DOUBLE PRECISION
);

-- CreateIndex
CREATE UNIQUE INDEX "payment_saleId_key" ON "public"."payment"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "sale_coupon_saleId_couponId_key" ON "public"."sale_coupon"("saleId", "couponId");

-- CreateIndex
CREATE UNIQUE INDEX "sale_item_saleId_productId_key" ON "public"."sale_item"("saleId", "productId");

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."payment" ADD CONSTRAINT "payment_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "public"."card"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale_coupon" ADD CONSTRAINT "sale_coupon_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sale_coupon" ADD CONSTRAINT "sale_coupon_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "public"."coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
