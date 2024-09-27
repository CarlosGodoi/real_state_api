-- CreateEnum
CREATE TYPE "TipoImovel" AS ENUM ('CASA', 'APARTAMENTO');

-- AlterTable
ALTER TABLE "Imovel" ADD COLUMN     "quantidade_banheiros" INTEGER,
ADD COLUMN     "tipoImovel" "TipoImovel";
