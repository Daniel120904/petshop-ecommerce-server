/*
  Warnings:

  - Added the required column `updatedAt` to the `active_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."active_token" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
