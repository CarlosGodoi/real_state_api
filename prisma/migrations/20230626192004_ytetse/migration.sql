-- DropForeignKey
ALTER TABLE "imovel_usuarios" DROP CONSTRAINT "imovel_usuarios_usuarioId_fkey";

-- AlterTable
ALTER TABLE "imovel_usuarios" ALTER COLUMN "usuarioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "imovel_usuarios" ADD CONSTRAINT "imovel_usuarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
