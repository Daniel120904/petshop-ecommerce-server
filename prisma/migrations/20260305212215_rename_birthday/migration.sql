/*
  Warnings:

  - You are about to drop the column `dataNascimento` on the `user` table. All the data in the column will be lost.
  - Added the required column `birthday` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "dataNascimento",
ADD COLUMN     "birthday" TIMESTAMP(3) NOT NULL;
