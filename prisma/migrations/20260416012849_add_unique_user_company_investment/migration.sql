/*
  Warnings:

  - A unique constraint covering the columns `[userId,companyId]` on the table `Investment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Investment_userId_companyId_key" ON "Investment"("userId", "companyId");
