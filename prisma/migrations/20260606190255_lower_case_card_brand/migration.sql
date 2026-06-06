/*
  Warnings:

  - The values [VISA,MASTERCARD,AMEX,ELO,HIPERCARD] on the enum `card_brand` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."card_brand_new" AS ENUM ('visa', 'mastercard', 'amex', 'elo', 'hipercard');
ALTER TABLE "public"."card" ALTER COLUMN "brand" TYPE "public"."card_brand_new" USING ("brand"::text::"public"."card_brand_new");
ALTER TYPE "public"."card_brand" RENAME TO "card_brand_old";
ALTER TYPE "public"."card_brand_new" RENAME TO "card_brand";
DROP TYPE "public"."card_brand_old";
COMMIT;
