/*
  Warnings:

  - You are about to drop the `state_ref` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nickname` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."city" DROP CONSTRAINT "city_stateId_fkey";

-- AlterTable
ALTER TABLE "public"."address" ADD COLUMN     "nickname" TEXT NOT NULL;

-- DropTable
DROP TABLE "public"."state_ref";

-- CreateTable
CREATE TABLE "public"."state" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" VARCHAR(2) NOT NULL,

    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "state_name_key" ON "public"."state"("name");

-- CreateIndex
CREATE UNIQUE INDEX "state_abbreviation_key" ON "public"."state"("abbreviation");

-- AddForeignKey
ALTER TABLE "public"."city" ADD CONSTRAINT "city_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "public"."state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
