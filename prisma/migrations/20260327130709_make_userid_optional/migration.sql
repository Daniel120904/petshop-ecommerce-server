/*
  Warnings:

  - Made the column `userId` on table `authentication` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."authentication" ALTER COLUMN "userId" SET NOT NULL;
