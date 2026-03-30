/*
  Warnings:

  - You are about to drop the column `streetNumber` on the `address` table. All the data in the column will be lost.
  - Added the required column `number` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."address" DROP COLUMN "streetNumber",
ADD COLUMN     "number" TEXT NOT NULL;
