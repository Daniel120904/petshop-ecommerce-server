/*
  Warnings:

  - Added the required column `updatedAt` to the `blacklisted_token` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."blacklisted_token" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
