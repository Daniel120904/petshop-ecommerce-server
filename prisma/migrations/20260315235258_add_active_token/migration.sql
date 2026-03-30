/*
  Warnings:

  - You are about to drop the `blacklisted_token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."blacklisted_token";

-- CreateTable
CREATE TABLE "public"."active_token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "active_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "active_token_token_key" ON "public"."active_token"("token");

-- AddForeignKey
ALTER TABLE "public"."active_token" ADD CONSTRAINT "active_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
