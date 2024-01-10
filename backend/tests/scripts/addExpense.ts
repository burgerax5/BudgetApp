import { UserService } from "../../src/services/userService"
import { CategoryService } from "../../src/services/categoryService"
import { ExpenseService } from "../../src/services/expenseService"
import { currencies } from "src/constants/currencies"

import {
    Category as PrismaCategory,
    Currency as PrismaCurrency,
} from '@prisma/client'

interface Category extends PrismaCategory { }
interface Currency extends PrismaCurrency { }

const get_expense_details = () => {
    return {
        // Parameters for expense
        user_id: 1,
        currency_id: 106,
        amount: 49.99,
        name: "Cyberpunk 2077: Phantom Liberty",
        date: new Date(),
        category_id: 2
    }
}

export async function addMockExpense(userService: UserService, categoryService: CategoryService, expenseService: ExpenseService): Promise<{
    success: boolean, error: unknown
}> {
    try {
        const expense_details = get_expense_details()

        const userExists = await userService.getUserById(1)
        if (!userExists)
            throw new Error('User does not exist')

        const categoryExists = await categoryService.getCategoryById(2)
        if (!categoryExists)
            throw new Error('Category does not exist')

        await expenseService.addExpense(expense_details)
        return { success: true, error: null }

    } catch (error) {
        console.error('Error occurred while adding mock expense:', error)
        return { success: false, error: error }
    }
}

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
