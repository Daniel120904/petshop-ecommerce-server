/*
  Warnings:

  - You are about to drop the column `subCategoryId` on the `product` table. All the data in the column will be lost.
  - The `image` column on the `product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "public"."product" DROP CONSTRAINT "product_subCategoryId_fkey";

-- DropIndex
DROP INDEX "public"."sub_category_name_key";

-- AlterTable
ALTER TABLE "public"."product" DROP COLUMN "subCategoryId",
DROP COLUMN "image",
ADD COLUMN     "image" TEXT[];

-- AlterTable
ALTER TABLE "public"."sub_category" ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."product_sub_category" (
    "productId" INTEGER NOT NULL,
    "subCategoryId" INTEGER NOT NULL,

    CONSTRAINT "product_sub_category_pkey" PRIMARY KEY ("productId","subCategoryId")
);

-- AddForeignKey
ALTER TABLE "public"."product_sub_category" ADD CONSTRAINT "product_sub_category_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_sub_category" ADD CONSTRAINT "product_sub_category_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "public"."sub_category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
