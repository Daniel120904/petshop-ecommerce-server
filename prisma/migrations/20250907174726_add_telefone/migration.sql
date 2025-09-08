-- CreateTable
CREATE TABLE "public"."Telefone" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "ddd" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Telefone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Telefone_userId_key" ON "public"."Telefone"("userId");

-- AddForeignKey
ALTER TABLE "public"."Telefone" ADD CONSTRAINT "Telefone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
