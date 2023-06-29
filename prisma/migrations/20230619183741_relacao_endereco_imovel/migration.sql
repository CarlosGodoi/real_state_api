/*
  Warnings:

  - You are about to drop the column `enderecoId` on the `Imovel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[imovelId]` on the table `endereco` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Imovel" DROP CONSTRAINT "Imovel_enderecoId_fkey";

-- DropIndex
DROP INDEX "Imovel_enderecoId_key";

-- AlterTable
ALTER TABLE "Imovel" DROP COLUMN "enderecoId";

-- CreateIndex
CREATE UNIQUE INDEX "endereco_imovelId_key" ON "endereco"("imovelId");

-- AddForeignKey
ALTER TABLE "endereco" ADD CONSTRAINT "endereco_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
