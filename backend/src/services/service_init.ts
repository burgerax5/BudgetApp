import { UserService } from "./userService";
// import { ExpenseServices } from "./expenseService";
// import { BudgetServices } from "./budgetService";
// import { CategoryServices } from "./categoryService";
import { PrismaClient } from '@prisma/client';

export const userService: UserService = new UserService()
// export const expenseService: ExpenseServices = new ExpenseServices()
// export const categoryService: CategoryServices = new CategoryServices()
// export const budgetService: BudgetServices = new BudgetServices()
export const prisma = new PrismaClient()