-- DropForeignKey
ALTER TABLE "public"."Cartao" DROP CONSTRAINT "Cartao_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Cartao" ADD CONSTRAINT "Cartao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
