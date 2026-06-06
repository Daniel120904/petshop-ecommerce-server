/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `sub_category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "sub_category_name_key" ON "public"."sub_category"("name");
