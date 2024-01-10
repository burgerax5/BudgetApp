// import { UserService } from "../../src/services/userService"
// import { CategoryService } from "../../src/services/categoryService"
// import { ExpenseService } from "../../src/services/expenseService"

// import { Category as PrismaCategory,
// Currency as PrismaCurrency,
//  } from '@prisma/client'

// interface Category extends PrismaCategory {}
// interface Currency extends PrismaCurrency {}

// const mockCurrency: Currency = {cc:"NZD",symbol:"NZ$",name:"New Zealand dollar"}

// const get_expense_details = async (userService: UserService, categoryService: CategoryService, expenseService: ExpenseService) => {

//     const currency_i

//     return {
//         // Parameters for expense
//         user_id: 0,
//         currency: mockCurrency,
//         amount: 49.99,
//         name: "Cyberpunk 2077: Phantom Liberty",
//         date: new Date(),
//         categoryId: await categoryService.getCategoryByName("Entertainment")
//     }
// }

// export function addMockExpense(userService: UserService, categoryService: CategoryService, expenseService: ExpenseService): void {
//     const expense_details = get_expense_details(userService, categoryService, expenseService)

//     if (expense_details.user_id !== undefined && expense_details.category) {
//         expenseService.addExpense(expense_details)
//     }
// }

// export function datedMockExpense(userService: UserService, categoryService: CategoryService,
//     expenseService: ExpenseService, date: Date): void {
//     let expense_details = get_expense_details(userService, categoryService, expenseService)
//     expense_details.date = date

//     if (expense_details.user_id !== undefined && expense_details.category) {
//         expenseService.addExpense(expense_details)
//     }
// }

// export function categorizedMockExpense(userService: UserService, categoryService: CategoryService,
//     expenseService: ExpenseService, category: Category): void {
//     let expense_details = get_expense_details(userService, categoryService, expenseService)
//     expense_details.category = category

//     if (expense_details.user_id !== undefined && category) {
//         expenseService.addExpense(expense_details)
//     }
// }
