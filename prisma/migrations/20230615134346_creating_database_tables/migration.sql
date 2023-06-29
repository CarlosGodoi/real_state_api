-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CORRETOR', 'COMPRADOR');

-- CreateEnum
CREATE TYPE "StatusImovel" AS ENUM ('NEGOCIACAO', 'VENDIDO', 'ALUGADO');

-- CreateEnum
CREATE TYPE "TipoContrato" AS ENUM ('VENDA', 'ALUGUEL');

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT,
    "perfil" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endereco" (
    "id" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "cep" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "endereco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comprador_imovel" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "comprador_imovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imovel_usuarios" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "imovel_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imovel" (
    "id" TEXT NOT NULL,
    "tipo_contrato" "TipoContrato" NOT NULL,
    "quantidade_quartos" INTEGER NOT NULL,
    "area" DOUBLE PRECISION NOT NULL,
    "preco" INTEGER NOT NULL,
    "enderecoId" TEXT NOT NULL,
    "status" "StatusImovel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "endereco_imovelId_key" ON "endereco"("imovelId");

-- CreateIndex
CREATE UNIQUE INDEX "imovel_usuarios_imovelId_key" ON "imovel_usuarios"("imovelId");

-- CreateIndex
CREATE UNIQUE INDEX "Imovel_enderecoId_key" ON "Imovel"("enderecoId");

-- AddForeignKey
ALTER TABLE "comprador_imovel" ADD CONSTRAINT "comprador_imovel_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comprador_imovel" ADD CONSTRAINT "comprador_imovel_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imovel_usuarios" ADD CONSTRAINT "imovel_usuarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imovel_usuarios" ADD CONSTRAINT "imovel_usuarios_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imovel" ADD CONSTRAINT "Imovel_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
