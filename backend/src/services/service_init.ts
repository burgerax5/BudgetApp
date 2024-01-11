import { UserService } from './userService';
import { ExpenseService } from "./expenseService";
// import { BudgetService } from "./budgetService";
import { CategoryService } from "./categoryService";
import { CurrencyService } from './currencyService';
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient()
export const userService: UserService = new UserService(prisma)
export const expenseService: ExpenseService = new ExpenseService(prisma)
export const categoryService: CategoryService = new CategoryService(prisma)
export const currencyService: CurrencyService = new CurrencyService(prisma)
// export const budgetService: BudgetService = new BudgetServices(prisma)

// Populate default entries
const populate = async () => {
    await categoryService.populate_categories()
    await currencyService.populate_currencies()
}

populate()