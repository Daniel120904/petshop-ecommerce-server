-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "genero" TEXT NOT NULL,
    "dataNascimento" TIMESTAMP(3) NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_cpf_key" ON "public"."User"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");
