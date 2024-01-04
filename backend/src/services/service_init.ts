import { UserService } from "./userService";
import { ExpenseServices } from "./expenseService";
import { BudgetServices } from "./budgetService";
import { CategoryServices } from "./categoryService";

export const userService: UserService = new UserService()
export const expenseService: ExpenseServices = new ExpenseServices()
export const categoryService: CategoryServices = new CategoryServices()
export const budgetService: BudgetServices = new BudgetServices()