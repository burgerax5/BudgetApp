/*
  Warnings:

  - Added the required column `amount` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `budget_year` to the `Budget` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Expense` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "budget_month" INTEGER,
ADD COLUMN     "budget_year" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Expense" ADD COLUMN     "amount" INTEGER NOT NULL;
