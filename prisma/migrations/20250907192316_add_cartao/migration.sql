-- CreateTable
CREATE TABLE "public"."Cartao" (
    "id" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "bandeira" TEXT NOT NULL,
    "cvv" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Cartao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Cartao" ADD CONSTRAINT "Cartao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
