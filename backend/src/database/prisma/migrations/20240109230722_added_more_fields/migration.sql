/*
  Warnings:

  - You are about to drop the column `amount` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `budget_month` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `budget_year` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Budget` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Expense` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Expense` table. All the data in the column will be lost.
  - Made the column `userId` on table `Budget` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userId` on table `Expense` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Budget" DROP CONSTRAINT "Budget_userId_fkey";

-- DropForeignKey
ALTER TABLE "Expense" DROP CONSTRAINT "Expense_userId_fkey";

-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "amount",
DROP COLUMN "budget_month",
DROP COLUMN "budget_year",
DROP COLUMN "createdAt",
ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Expense" DROP COLUMN "amount",
DROP COLUMN "createdAt",
ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
