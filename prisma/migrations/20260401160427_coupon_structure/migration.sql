/*
  Warnings:

  - You are about to drop the column `discountPercentage` on the `coupon` table. All the data in the column will be lost.
  - You are about to drop the column `discountValue` on the `coupon` table. All the data in the column will be lost.
  - Added the required column `type` to the `coupon` table without a default value. This is not possible if the table is not empty.
  - Made the column `code` on table `coupon` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "public"."coupon_type" AS ENUM ('percent', 'value');

-- AlterTable
ALTER TABLE "public"."coupon" DROP COLUMN "discountPercentage",
DROP COLUMN "discountValue",
ADD COLUMN     "discount" DOUBLE PRECISION,
ADD COLUMN     "maxUses" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "type" "public"."coupon_type" NOT NULL,
ALTER COLUMN "code" SET NOT NULL;
