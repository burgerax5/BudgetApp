import { UserService } from "../../src/services/userService"
import { CategoryService } from "../../src/services/categoryService"
import { ExpenseService } from "../../src/services/expenseService"

import {
    Category as PrismaCategory,
} from '@prisma/client'

const get_expense_details = () => {
    return {
        // Parameters for expense
        userId: 1,
        amount: 49.99,
        name: "Cyberpunk 2077: Phantom Liberty",
        day: 1,
        month: 1,
        year: 2023,
        categoryId: 2
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

        if (error instanceof Error && error.message.includes('deadlock detected')) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            return addMockExpense(userService, categoryService, expenseService)
        }

        return { success: false, error: error }
    }
}

export async function datedMockExpense(userService: UserService, categoryService: CategoryService,
    expenseService: ExpenseService, date: Date) {
    try {
        let expense_details = get_expense_details()
        expense_details.day = date.getDate()
        expense_details.month = date.getMonth() + 1
        expense_details.year = date.getFullYear()

        if (expense_details.userId && expense_details.categoryId) {
            await expenseService.addExpense(expense_details)
        }
        return { success: true, error: null }
    } catch (error) {
        console.error('An error occurred while creating dated mock expense:', error)

        if (error instanceof Error && error.message.includes('deadlock detected')) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            return addMockExpense(userService, categoryService, expenseService)
        }

        return { success: false, error: error }
    }
}

export async function categorizedMockExpense(userService: UserService, categoryService: CategoryService,
    expenseService: ExpenseService, category_id: number): Promise<void> {
    let expense_details = get_expense_details()
    expense_details.categoryId = category_id

    if (expense_details.userId && category_id)
        await expenseService.addExpense(expense_details)
}
