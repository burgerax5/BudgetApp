// import { UserService } from "../../src/services/userService"
// import { CategoryServices } from "../../src/services/categoryService"
// import { ExpenseServices } from "../../src/services/expenseService"
// import { Currency } from "../src/models/Currency"
// import { Category } from "../src/models/Category"

// const mockCurrency: Currency = {"cc":"NZD","symbol":"NZ$","name":"New Zealand dollar"}

// const get_expense_details = (userService: UserService, categoryService: CategoryServices, expenseService: ExpenseServices) => {
//     return {
//         // Parameters for expense
//         user_id: 0,
//         currency: mockCurrency,
//         amount: 49.99,
//         name: "Cyberpunk 2077: Phantom Liberty",
//         date: new Date(),
//         category: categoryService.getAllCategories()[1]
//     }
// }

// export function addMockExpense(userService: UserService, categoryService: CategoryServices, expenseService: ExpenseServices): void {
//     const expense_details = get_expense_details(userService, categoryService, expenseService)

//     if (expense_details.user_id !== undefined && expense_details.category) {
//         expenseService.addExpense(expense_details)
//     }
// }

// export function datedMockExpense(userService: UserService, categoryService: CategoryServices,
//     expenseService: ExpenseServices, date: Date): void {
//     let expense_details = get_expense_details(userService, categoryService, expenseService)
//     expense_details.date = date

//     if (expense_details.user_id !== undefined && expense_details.category) {
//         expenseService.addExpense(expense_details)
//     }
// }

// export function categorizedMockExpense(userService: UserService, categoryService: CategoryServices,
//     expenseService: ExpenseServices, category: Category): void {
//     let expense_details = get_expense_details(userService, categoryService, expenseService)
//     expense_details.category = category

//     if (expense_details.user_id !== undefined && category) {
//         expenseService.addExpense(expense_details)
//     }
// }
