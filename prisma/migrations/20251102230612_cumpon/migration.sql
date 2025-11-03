-- AlterTable
ALTER TABLE "public"."Coupon" ALTER COLUMN "code" DROP NOT NULL,
ALTER COLUMN "discountPercentage" DROP NOT NULL,
ALTER COLUMN "discountValue" DROP NOT NULL;
