-- CreateTable
CREATE TABLE "public"."Endereco" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipoEndereco" TEXT NOT NULL,
    "tipoResidencia" TEXT NOT NULL,
    "tipoLogradouro" TEXT NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pais" TEXT NOT NULL,
    "observacoes" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Endereco" ADD CONSTRAINT "Endereco_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
