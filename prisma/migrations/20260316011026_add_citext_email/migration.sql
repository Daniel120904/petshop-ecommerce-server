CREATE EXTENSION IF NOT EXISTS citext;

-- AlterTable
ALTER TABLE "public"."authentication" ALTER COLUMN "email" SET DATA TYPE CITEXT;