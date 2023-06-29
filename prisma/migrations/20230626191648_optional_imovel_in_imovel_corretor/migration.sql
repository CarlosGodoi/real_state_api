-- DropForeignKey
ALTER TABLE "imovel_usuarios" DROP CONSTRAINT "imovel_usuarios_imovelId_fkey";

-- AlterTable
ALTER TABLE "imovel_usuarios" ALTER COLUMN "imovelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "imovel_usuarios" ADD CONSTRAINT "imovel_usuarios_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
