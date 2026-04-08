-- 1. Remove colunas antigas ANTES de mexer no enum
ALTER TABLE "public"."payment" DROP COLUMN "statusPayment";
ALTER TABLE "public"."payment" DROP COLUMN "typePayment";

-- 2. Agora recria o enum sem credit_card (sem dependências)
CREATE TYPE "public"."payment_type_new" AS ENUM ('card', 'pix', 'boleto');
ALTER TYPE "public"."payment_type" RENAME TO "payment_type_old";
ALTER TYPE "public"."payment_type_new" RENAME TO "payment_type";
DROP TYPE "public"."payment_type_old";

-- 3. Adiciona colunas novas com default temporário
ALTER TABLE "public"."payment" ADD COLUMN "status" "public"."payment_status" NOT NULL DEFAULT 'pending';
ALTER TABLE "public"."payment" ADD COLUMN "type" "public"."payment_type" NOT NULL DEFAULT 'pix';
ALTER TABLE "public"."payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."payment" ALTER COLUMN "type" DROP DEFAULT;

-- 4. Altera coupon
ALTER TABLE "public"."coupon" ALTER COLUMN "discount" SET NOT NULL;

-- 5. Altera product
ALTER TABLE "public"."product" DROP COLUMN "image";
ALTER TABLE "public"."product" ADD COLUMN "images" TEXT[];
ALTER TABLE "public"."product" ADD COLUMN "salePrice" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- 6. Altera sale
ALTER TABLE "public"."sale" ADD COLUMN "cancelReason" TEXT;