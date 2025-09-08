/*
  Warnings:

  - You are about to drop the column `Preferencial` on the `Cartao` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Cartao" DROP COLUMN "Preferencial",
ADD COLUMN     "preferencial" BOOLEAN NOT NULL DEFAULT false;
