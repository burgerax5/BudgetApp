import { UserService } from "../src/services/userService"
import { CategoryServices } from "../src/services/categoryService"
import { ExpenseServices } from "../src/services/expenseService"
import { Currency } from "../src/models/Currency"

export function addMockExpense(userService: UserService, categoryService: CategoryServices, expenseService: ExpenseServices): boolean {
    // Parameters for expense
    const user_id = userService.getUserByUsername('bob')?.user_id
    const currency: Currency = {"cc":"NZD","symbol":"NZ$","name":"New Zealand dollar"}
    const amount = 49.99
    const name = "Cyberpunk 2077: Phantom Liberty"
    const date: Date = new Date()
    const category = categoryService.getCategoryByName('Entertainment')

    let isAdded: boolean = false

    if (user_id !== undefined && category) {
        isAdded = expenseService.addExpense(user_id, currency, amount, name, date, category)
    } 
    return isAdded
}