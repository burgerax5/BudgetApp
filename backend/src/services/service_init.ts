import { UserService } from './userService';
import { ExpenseService } from "./expenseService";
import { BudgetService } from "./budgetService";
import { CategoryService } from "./categoryService";
import { PrismaClient } from '@prisma/client';
import { currencies } from '../constants/currencies';

export const prisma = new PrismaClient()
export const userService: UserService = new UserService(prisma)
export const expenseService: ExpenseService = new ExpenseService(prisma)
export const categoryService: CategoryService = new CategoryService(prisma)
export const budgetService: BudgetService = new BudgetService(prisma)

// Populate default entries
export const populate = async () => {
    await categoryService.populate_categories()
}