-- DropIndex
DROP INDEX "Investment_userId_companyId_key";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "siteInvestment" INTEGER NOT NULL DEFAULT 0;
