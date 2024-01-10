import { UserService } from './userService';
import { ExpenseService } from "./expenseService";
// import { BudgetService } from "./budgetService";
import { CategoryService } from "./categoryService";
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient()
export const userService: UserService = new UserService(prisma)
export const expenseService: ExpenseService = new ExpenseService(prisma)
export const categoryService: CategoryService = new CategoryService(prisma)
// export const budgetService: BudgetServices = new BudgetServices()