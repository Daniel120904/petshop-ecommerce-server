/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Cartao` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Cartao` table. All the data in the column will be lost.
  - Added the required column `Preferencial` to the `Cartao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Cartao" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "Preferencial" BOOLEAN NOT NULL;
