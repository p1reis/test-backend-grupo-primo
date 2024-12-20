-- CreateEnum
CREATE TYPE "TransactionTypeEnum" AS ENUM ('DEPOSIT', 'WITHDRAW', 'TRANSFER');

-- CreateTable
CREATE TABLE "accounts" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "Numero" TEXT NOT NULL,
    "Nome" TEXT NOT NULL,
    "Sobrenome" TEXT NOT NULL,
    "CPF" TEXT NOT NULL,
    "Saldo" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "cuid" TEXT NOT NULL,
    "Tipo" "TransactionTypeEnum" NOT NULL,
    "Valor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Origem" TEXT NOT NULL,
    "Destino" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_cuid_key" ON "accounts"("cuid");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_Numero_key" ON "accounts"("Numero");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_CPF_key" ON "accounts"("CPF");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_cuid_key" ON "transactions"("cuid");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_Destino_fkey" FOREIGN KEY ("Destino") REFERENCES "accounts"("cuid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_Origem_fkey" FOREIGN KEY ("Origem") REFERENCES "accounts"("cuid") ON DELETE RESTRICT ON UPDATE CASCADE;
