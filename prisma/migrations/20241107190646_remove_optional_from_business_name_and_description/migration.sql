/*
  Warnings:

  - Made the column `businessName` on table `Imovel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `Imovel` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Imovel" ALTER COLUMN "businessName" SET NOT NULL,
ALTER COLUMN "description" SET NOT NULL;
