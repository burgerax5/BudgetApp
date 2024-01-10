import { ExpenseService } from "../../src/services/expenseService";
import { UserService } from "../../src/services/userService";
import { CategoryService } from "../../src/services/categoryService";
import { jestRegister } from "../scripts/registerUser";
import { addMockExpense } from "../scripts/addExpense";
import { PrismaClient } from "@prisma/client";
import { CurrencyService } from "../../src/services/currencyService";
import { resetTables } from "../scripts/resetTables";

describe('Test initialization and adding', () => {
    let expenseService: ExpenseService
    let userService: UserService
    let categoryService: CategoryService
    let currencyService: CurrencyService
    let prisma: PrismaClient

    beforeEach(async () => {
        prisma = new PrismaClient()
        expenseService = new ExpenseService(prisma)
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)
        currencyService = new CurrencyService(prisma)

        await resetTables(prisma)

        // Initialize user and currencies
        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
        await currencyService.populate_currencies()
    })

    it('should initially be an empty list', async () => {
        const all_expenses = await expenseService.getAllExpenses()
        expect(all_expenses.length).toBe(0)
    })

    it('should add a new expense', async () => {
        const expenses1 = await expenseService.getAllExpenses()
        expect(expenses1.length).toBe(0)

        const { success, error } = await addMockExpense(userService, categoryService, expenseService)
        expect(success).toBeTruthy()
        expect(error).toBeNull()

        const expenses2 = await expenseService.getAllExpenses()
        expect(expenses2.length).toBe(1)
    })

    it('should increment the expense_id after each expense added', async () => {
        const { success: s1, error: err1 } = await addMockExpense(userService, categoryService, expenseService)
        expect(s1).toBeTruthy()

        const { success: s2, error: err2 } = await addMockExpense(userService, categoryService, expenseService)
        expect(s2).toBeTruthy()

        const all_expenses = await expenseService.getAllExpenses()
        expect(all_expenses.length).toBe(2)
        expect(all_expenses[0].id).toBe(1)
        expect(all_expenses[1].id).toBe(2)
    })

    afterAll(async () => {
        await resetTables(prisma)
        await prisma.$disconnect()
    })
})

describe('Test if there are ids provided for rows that do not exist', () => {
    let expenseService: ExpenseService
    let userService: UserService
    let categoryService: CategoryService
    let currencyService: CurrencyService
    let prisma: PrismaClient

    beforeEach(async () => {
        prisma = new PrismaClient()
        expenseService = new ExpenseService(prisma)
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)
        currencyService = new CurrencyService(prisma)

        await resetTables(prisma)
    })

    it('should return an error saying user does not exist', async () => {
        const { success, error } = await addMockExpense(userService, categoryService, expenseService)
        expect(success).toBeFalsy()

        if (error instanceof Error)
            expect(error.message).toBe('User does not exist')
    })

    it('should return an error saying category does not exist', async () => {
        await jestRegister('xiao', 'password', userService)
        const { success, error } = await addMockExpense(userService, categoryService, expenseService)
        expect(success).toBeFalsy()

        if (error instanceof Error)
            expect(error.message).toBe('Category does not exist')
    })

    afterAll(async () => {
        await resetTables(prisma)
        await prisma.$disconnect()
    })
})

// describe('Test modifying existing expenses', () => {
//     let expenseService: ExpenseService
//     let userService: UserService
//     let categoryService: CategoryService

//     beforeEach(async () => {
//         expenseService = new ExpenseService()
//         userService = new UserService()
//         categoryService = new CategoryService()
//         await jestRegister('bob', 'password123', userService)
//     })

//     it('should remove an expense from the list', () => {
//         addMockExpense(userService, categoryService, expenseService)

//         let all_expenses = expenseService.getAllExpenses()
//         expect(all_expenses.length).toBe(1)

//         let isDeleted: boolean = expenseService.deleteExpense(all_expenses[0])
//         expect(isDeleted).toBeTruthy()

//         all_expenses = expenseService.getAllExpenses()
//         expect(all_expenses.length).toBe(0)
//     })

//     it('should modify the details of an expense', () => {
//         addMockExpense(userService, categoryService, expenseService)
//         const expenseToEdit: Expense = expenseService.getAllExpenses()[0]

//         const new_amount = 109.00
//         const new_name = "Final Fantasy VII Rebirth"
//         const new_date = new Date()
//         const new_expense_details = {
//             new_amount, new_date, new_name
//         }

//         expenseService.editExpense(expenseToEdit, new_expense_details)
//         const editedExpense: Expense = expenseService.getAllExpenses()[0]

//         expect(editedExpense.currency).toEqual({"cc":"NZD","symbol":"NZ$","name":"New Zealand dollar"}) // Stays the same
//         expect(editedExpense.amount).toBe(109.00)
//         expect(editedExpense.name).toBe("Final Fantasy VII Rebirth")
//         expect(editedExpense.date).toBe(new_date)
//         expect(editedExpense.category.name).toBe("Entertainment") // Stays the same
//     })
// })

// describe('Get expenses by month and year', () => {
//     let expenseService: ExpenseService
//     let userService: UserService
//     let categoryService: CategoryService

//     beforeEach(async () => {
//         expenseService = new ExpenseService()
//         userService = new UserService()
//         categoryService = new CategoryService()
//         await jestRegister('bob', 'password123', userService)
//     })

//     it("should return alice's expenses by month", () => {
//         const user: User = userService.getAllUsers()[0]

//         datedMockExpense(userService, categoryService, expenseService, new Date('August, 31, 2023'))
//         datedMockExpense(userService, categoryService, expenseService, new Date('October, 10, 2023')) // Oct 2023
//         datedMockExpense(userService, categoryService, expenseService, new Date('December, 13, 2023')) // Dec 2023
//         datedMockExpense(userService, categoryService, expenseService, new Date('December, 26, 2023')) // Dec 2023

//         const all_expenses: Expense[] = expenseService.getAllExpenses()

//         const august: Expense[] = expenseService.getUserExpenseByMonth(user, 8, 2023)
//         const october: Expense[] = expenseService.getUserExpenseByMonth(user, 10, 2023)
//         const december: Expense[] = expenseService.getUserExpenseByMonth(user, 12, 2023)

//         // Confirm correct number of expenses
//         expect(august.length).toBe(1)
//         expect(october.length).toBe(1)
//         expect(december.length).toBe(2)

//         // Confirm the validity of entries
//         expect(august[0]).toBe(all_expenses[0])
//         expect(october[0]).toBe(all_expenses[1])
//         expect(december[0]).toBe(all_expenses[2])
//         expect(december[1]).toBe(all_expenses[3])
//     })

//     it("should return all expenses from 2023", () => {
//         const user: User = userService.getAllUsers()[0]

//         datedMockExpense(userService, categoryService, expenseService, new Date('August, 31, 2021'))
//         datedMockExpense(userService, categoryService, expenseService, new Date('October, 10, 2022'))
//         datedMockExpense(userService, categoryService, expenseService, new Date('December, 13, 2023'))
//         datedMockExpense(userService, categoryService, expenseService, new Date('December, 26, 2023'))

//         const all_expenses: Expense[] = expenseService.getAllExpenses()

//         const expenses_in_2021: Expense[] = expenseService.getUserExpenseByYear(user, 2021)
//         expect(expenses_in_2021.length).toBe(1)
//         expect(expenses_in_2021[0]).toBe(all_expenses[0])

//         const expenses_in_2022: Expense[] = expenseService.getUserExpenseByYear(user, 2022)
//         expect(expenses_in_2022.length).toBe(1)
//         expect(expenses_in_2022[0]).toBe(all_expenses[1])

//         const expenses_in_2023: Expense[] = expenseService.getUserExpenseByYear(user, 2023)
//         expect(expenses_in_2023.length).toBe(2)
//         expect(expenses_in_2023[0]).toBe(all_expenses[2])
//         expect(expenses_in_2023[1]).toBe(all_expenses[3])
//     })
// })

// describe('Get expenses by category', () => {
//     let expenseService: ExpenseService
//     let userService: UserService
//     let categoryService: CategoryService

//     beforeEach(async () => {
//         expenseService = new ExpenseService()
//         userService = new UserService()
//         categoryService = new CategoryService()
//         await jestRegister('bob', 'password123', userService)
//     })

//     it("should return all of bob's expenses that are under entertainment", () => {
//         const user: User = userService.getAllUsers()[0]
//         const entertainment = categoryService.getCategoryByName('Entertainment')
//         const foodndrink = categoryService.getCategoryByName('Food & Drink')

//         expect(entertainment).not.toBeUndefined()
//         expect(foodndrink).not.toBeUndefined()

//         if (entertainment && foodndrink) {
//             categorizedMockExpense(userService, categoryService, expenseService, entertainment)
//             categorizedMockExpense(userService, categoryService, expenseService, entertainment)
//             categorizedMockExpense(userService, categoryService, expenseService, foodndrink)

//             const all_expenses = expenseService.getAllExpenses()

//             const entertainment_expenses = expenseService.getUserExpenseByCategory(user, entertainment)
//             const foodndrink_expenses = expenseService.getUserExpenseByCategory(user, foodndrink)

//             expect(entertainment_expenses.length).toBe(2)
//             expect(foodndrink_expenses.length).toBe(1)
//         }
//     })
// })

// describe('Get expense by id', () => {
//     let expenseService: ExpenseService
//     let userService: UserService
//     let categoryService: CategoryService
//     let prisma: PrismaClient

//     beforeEach(async () => {
//         expenseService = new ExpenseService(prisma)
//         userService = new UserService(prisma)
//         categoryService = new CategoryService(prisma)
//         await jestRegister('bob', 'password123', userService)
//     })

//     it('should return undefined since there is no expense with id 1', async () => {
//         const expense = await expenseService.getExpenseById(1)
//         expect(expense).toBeNull()
//     })

//     it('should return the expense with id 1', async () => {
//         await addMockExpense(userService, categoryService, expenseService)

//         const expense = await expenseService.getExpenseById(1)
//         expect(expense).not.toBeNull()
//         expect(expense?.id).toBe(0)
//         expect(expense?.name).toBe("Cyberpunk 2077: Phantom Liberty")
//     })

//     afterAll(async () => {
//         await resetTables(prisma)
//         await prisma.$disconnect()
//     })
// })