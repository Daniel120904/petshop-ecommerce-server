/*
  Warnings:

  - You are about to drop the column `city` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `neighbor` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `residenceType` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `streetType` on the `address` table. All the data in the column will be lost.
  - Added the required column `cityId` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetNumber` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."address" DROP COLUMN "city",
DROP COLUMN "neighbor",
DROP COLUMN "number",
DROP COLUMN "residenceType",
DROP COLUMN "state",
DROP COLUMN "streetType",
ADD COLUMN     "cityId" INTEGER NOT NULL,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "streetNumber" TEXT NOT NULL;

-- DropEnum
DROP TYPE "public"."state";

-- CreateTable
CREATE TABLE "public"."city" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."state_ref" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" VARCHAR(2) NOT NULL,

    CONSTRAINT "state_ref_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "city_name_stateId_key" ON "public"."city"("name", "stateId");

-- CreateIndex
CREATE UNIQUE INDEX "state_ref_name_key" ON "public"."state_ref"("name");

-- CreateIndex
CREATE UNIQUE INDEX "state_ref_abbreviation_key" ON "public"."state_ref"("abbreviation");

-- CreateIndex
CREATE INDEX "address_cityId_idx" ON "public"."address"("cityId");

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."city" ADD CONSTRAINT "city_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "public"."state_ref"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
