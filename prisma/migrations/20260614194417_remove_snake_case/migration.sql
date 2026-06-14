/*
  Warnings:

  - The `status` column on the `sale` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `brand` on the `card` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `coupon` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `phone` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `sale_coupon` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PhoneType" AS ENUM ('telephone', 'cellphone');

-- CreateEnum
CREATE TYPE "CouponType" AS ENUM ('percent', 'value');

-- CreateEnum
CREATE TYPE "CardBrand" AS ENUM ('visa', 'mastercard', 'amex', 'elo', 'hipercard');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('card', 'pix', 'boleto');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('canceled', 'refunded', 'pending', 'paid');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('processing', 'approved', 'shipped', 'delivered', 'canceled');

-- DropIndex
DROP INDEX "user_genderId_idx";

-- DropIndex
DROP INDEX "user_roleId_idx";

-- AlterTable
ALTER TABLE "card" DROP COLUMN "brand",
ADD COLUMN     "brand" "CardBrand" NOT NULL;

-- AlterTable
ALTER TABLE "coupon" DROP COLUMN "type",
ADD COLUMN     "type" "CouponType" NOT NULL;

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "status",
ADD COLUMN     "status" "PaymentStatus" NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "PaymentType" NOT NULL;

-- AlterTable
ALTER TABLE "phone" DROP COLUMN "type",
ADD COLUMN     "type" "PhoneType" NOT NULL;

-- AlterTable
ALTER TABLE "sale" DROP COLUMN "status",
ADD COLUMN     "status" "SaleStatus" NOT NULL DEFAULT 'processing';

-- AlterTable
ALTER TABLE "sale_coupon" DROP COLUMN "type",
ADD COLUMN     "type" "CouponType" NOT NULL;

-- DropEnum
DROP TYPE "card_brand";

-- DropEnum
DROP TYPE "coupon_type";

-- DropEnum
DROP TYPE "payment_status";

-- DropEnum
DROP TYPE "payment_type";

-- DropEnum
DROP TYPE "phone_type";

-- DropEnum
DROP TYPE "sale_status";
