/*
  Warnings:

  - You are about to drop the column `cartId` on the `cart_item` table. All the data in the column will be lost.
  - You are about to drop the column `isDelete` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `active` on the `gender` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `isDelete` on the `sub_category` table. All the data in the column will be lost.
  - You are about to drop the `cart` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,productId]` on the table `cart_item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `cart_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `categoryId` to the `sub_category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."cart" DROP CONSTRAINT "cart_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."cart_item" DROP CONSTRAINT "cart_item_cartId_fkey";

-- DropForeignKey
ALTER TABLE "public"."product" DROP CONSTRAINT "product_categoryId_fkey";

-- AlterTable
ALTER TABLE "public"."cart_item" DROP COLUMN "cartId",
ADD COLUMN     "inStock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."category" DROP COLUMN "isDelete";

-- AlterTable
ALTER TABLE "public"."gender" DROP COLUMN "active",
ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."product" DROP COLUMN "categoryId",
DROP COLUMN "quantity",
ADD COLUMN     "stock" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "active" SET DEFAULT true,
ALTER COLUMN "isDelete" SET DEFAULT false;

-- AlterTable
ALTER TABLE "public"."sub_category" DROP COLUMN "isDelete",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."cart";

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_userId_productId_key" ON "public"."cart_item"("userId", "productId");

-- AddForeignKey
ALTER TABLE "public"."sub_category" ADD CONSTRAINT "sub_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cart_item" ADD CONSTRAINT "cart_item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
