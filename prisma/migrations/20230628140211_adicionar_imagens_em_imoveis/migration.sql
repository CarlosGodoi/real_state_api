-- CreateTable
CREATE TABLE "image_imovel" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "image_imovel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "image_imovel" ADD CONSTRAINT "image_imovel_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
