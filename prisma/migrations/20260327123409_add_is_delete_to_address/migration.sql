/*
  Warnings:

  - You are about to drop the column `observation` on the `address` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nickname,userId]` on the table `address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nickname,userId]` on the table `card` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."address" DROP COLUMN "observation",
ADD COLUMN     "isDelete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."authentication" ALTER COLUMN "email" SET DATA TYPE CITEXT;

-- CreateIndex
CREATE UNIQUE INDEX "address_nickname_userId_key" ON "public"."address"("nickname", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "card_nickname_userId_key" ON "public"."card"("nickname", "userId");
