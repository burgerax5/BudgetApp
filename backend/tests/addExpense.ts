import { UserService } from "../src/services/userService"
import { CategoryServices } from "../src/services/categoryService"
import { ExpenseServices } from "../src/services/expenseService"
import { Currency } from "../src/models/Currency"
import { Category } from "../src/models/Category"

export function addMockExpense(userService: UserService, categoryService: CategoryServices, expenseService: ExpenseServices): boolean {
    // Parameters for expense
    const user_id = userService.getUserByUsername('bob')?.user_id
    const currency: Currency = {"cc":"NZD","symbol":"NZ$","name":"New Zealand dollar"}
    const amount = 49.99
    const name = "Cyberpunk 2077: Phantom Liberty"
    const date: Date = new Date()
    const category = categoryService.getCategoryByName('Entertainment')

    if (user_id !== undefined && category) {
        return expenseService.addExpense(user_id, currency, amount, name, date, category)
    } return false
}

export function datedMockExpense(userService: UserService, categoryService: CategoryServices, 
    expenseService: ExpenseServices, date: Date) {
    // Parameters for expense
    const user_id = userService.getUserByUsername('bob')?.user_id
    const currency: Currency = {"cc":"NZD","symbol":"NZ$","name":"New Zealand dollar"}
    const amount = 49.99
    const name = "My Expense"
    const category = categoryService.getCategoryByName('Entertainment')

    if (user_id !== undefined && category) {
        return expenseService.addExpense(user_id, currency, amount, name, date, category)
    } return false
}

export function categorizedMockExpense(userService: UserService, categoryService: CategoryServices, 
    expenseService: ExpenseServices, category: Category) {
    // Parameters for expense
    const user_id = userService.getUserByUsername('bob')?.user_id
    const currency: Currency = {"cc":"NZD","symbol":"NZ$","name":"New Zealand dollar"}
    const amount = 49.99
    const name = "My Expense"
    const date: Date = new Date()

    if (user_id !== undefined && category) {
        return expenseService.addExpense(user_id, currency, amount, name, date, category)
    } return false
}
