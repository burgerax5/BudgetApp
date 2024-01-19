/*
  Warnings:

  - You are about to drop the column `currencyId` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `currencyId` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the `Currency` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_currencyId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_currencyId_fkey";

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "currencyId";

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "currencyId";

-- DropTable
DROP TABLE "Currency";
