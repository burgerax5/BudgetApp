import { ExpenseService } from "../../src/services/expenseService";
import { UserService } from "../../src/services/userService";
import { CategoryService } from "../../src/services/categoryService";
import { jestRegister } from "../scripts/registerUser";
import { addMockExpense, datedMockExpense, categorizedMockExpense } from "../scripts/addExpense";
import { PrismaClient } from "@prisma/client";
import { resetTables, cleanUp } from "../scripts/resetTables";
import { prisma } from "../../src/services/service_init";

describe('Test initialization and adding of expenses', () => {
    let expenseService: ExpenseService
    let userService: UserService
    let categoryService: CategoryService

    beforeEach(async () => {
        expenseService = new ExpenseService(prisma)
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)

        await resetTables(prisma)

        // Initialize user, categories, and currencies
        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
    })

    it('should initially be an empty list', async () => {
        const all_expenses = await expenseService.getAllExpenses()
        expect(all_expenses.length).toBe(0)
    })

    it('should add a new expense', async () => {
        const expenses1 = await expenseService.getAllExpenses()
        expect(expenses1.length).toBe(0)

        // Ensure user and categories are succesfully initialized
        expect(await userService.getUserById(1)).not.toBeNull()
        expect(await categoryService.getCategoryById(2)).not.toBeNull()

        const { success, error } = await addMockExpense(userService, categoryService, expenseService)
        expect(error).toBeNull()

        const expenses2 = await expenseService.getAllExpenses()
        expect(expenses2.length).toBe(1)
    })

    // FLAKY
    it('should increment the expense_id after each expense added', async () => {
        const { success: s1, error: err1 } = await addMockExpense(userService, categoryService, expenseService)
        expect(err1).toBeNull()

        const { success: s2, error: err2 } = await addMockExpense(userService, categoryService, expenseService)
        expect(err2).toBeNull()

        const all_expenses = await expenseService.getAllExpenses()
        expect(all_expenses.length).toBe(2)
        expect(all_expenses[0].id).toBe(1)
        expect(all_expenses[1].id).toBe(2)
    })

    afterAll(async () => await cleanUp(prisma))
})

describe('Test if there are ids provided for rows that do not exist', () => {
    let expenseService: ExpenseService
    let userService: UserService
    let categoryService: CategoryService

    beforeEach(async () => {
        expenseService = new ExpenseService(prisma)
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)

        await resetTables(prisma)
    })

    it('should return an error saying user does not exist', async () => {
        // Ensure user is not initialized
        expect(await userService.getUserById(1)).toBeNull()

        const { success, error } = await addMockExpense(userService, categoryService, expenseService)
        expect(success).toBeFalsy()

        if (error instanceof Error)
            expect(error.message).toBe('User does not exist')
    })

    it('should return an error saying category does not exist', async () => {
        await jestRegister('xiao', 'password', userService)
        expect(await userService.getUserById(1)).not.toBeNull()

        // Ensure category is not initialized
        expect(await categoryService.getCategoryById(2)).toBeNull()

        const { success, error } = await addMockExpense(userService, categoryService, expenseService)
        expect(success).toBeFalsy()

        if (error instanceof Error)
            expect(error.message).toBe('Category does not exist')
    })

    afterEach(async () => await cleanUp(prisma))
})

describe('Test updating and deleting existing expenses', () => {
    let expenseService: ExpenseService
    let userService: UserService
    let categoryService: CategoryService

    beforeEach(async () => {
        expenseService = new ExpenseService(prisma)
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)

        await resetTables(prisma)

        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
    })

    it('should remove an expense from the list', async () => {
        // Ensure user and categories are succesfully initialized
        expect(await userService.getUserById(1)).not.toBeNull()
        expect(await categoryService.getCategoryById(2)).not.toBeNull()

        const { success, error } = await addMockExpense(userService, categoryService, expenseService)

        let expenses_before = await expenseService.getAllExpenses()
        expect(expenses_before.length).toBe(1)

        await expenseService.deleteExpense(1)

        const expenses_after = await expenseService.getAllExpenses()
        expect(expenses_after.length).toBe(0)
    })

    it('should edit the details of an expense', async () => {
        // Ensure user and categories are succesfully initialized
        expect(await userService.getUserById(1)).not.toBeNull()
        expect(await categoryService.getCategoryById(2)).not.toBeNull()

        await addMockExpense(userService, categoryService, expenseService)

        const amount = 109.00
        const name = "Final Fantasy VII Rebirth"
        const day = 29
        const month = 2
        const year = 2024
        const categoryId = 2

        const new_details = { amount, day, month, year, name, categoryId }

        await expenseService.editExpense(1, new_details) // expenseId = 1
        const editedExpense = await expenseService.getExpenseById(1)

        expect(editedExpense?.amount).toBe(109.00)
        expect(editedExpense?.name).toBe("Final Fantasy VII Rebirth")
        expect(editedExpense?.day).toBe(29)
        expect(editedExpense?.month).toBe(2)
        expect(editedExpense?.year).toBe(2024)
        expect(editedExpense?.categoryId).toBe(2)
    })

    afterEach(async () => await cleanUp(prisma))
})

describe('Get expenses by month and year', () => {
    let expenseService: ExpenseService
    let userService: UserService
    let categoryService: CategoryService

    beforeEach(async () => {
        expenseService = new ExpenseService(prisma)
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)

        await resetTables(prisma)

        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
    })

    it("should return alice's expenses by month", async () => {
        const user = await userService.getUserById(1)

        await datedMockExpense(userService, categoryService, expenseService, new Date('August, 31, 2023')) // Aug 2023
        await datedMockExpense(userService, categoryService, expenseService, new Date('October, 10, 2023')) // Oct 2023
        await datedMockExpense(userService, categoryService, expenseService, new Date('December, 13, 2023')) // Dec 2023
        await datedMockExpense(userService, categoryService, expenseService, new Date('December, 26, 2023')) // Dec 2023

        const all_expenses = await expenseService.getAllExpenses()
        expect(all_expenses.length).toBe(4)

        const august = await expenseService.getExpenseByParams({
            userId: 1,
            month: 8,
            year: 2023
        })
        const october = await expenseService.getExpenseByParams({
            userId: 1,
            month: 10,
            year: 2023
        })
        const december = await expenseService.getExpenseByParams({
            userId: 1,
            month: 12,
            year: 2023
        })

        // Confirm correct number of expenses
        expect(august.length).toBe(1)
        expect(october.length).toBe(1)
        expect(december.length).toBe(2)

        // Confirm the validity of entries
        expect(august[0]).toEqual(all_expenses[0])
        expect(october[0]).toEqual(all_expenses[1])
        expect(december[0]).toEqual(all_expenses[2])
        expect(december[1]).toEqual(all_expenses[3])
    })

    it("should return all expenses from 2023", async () => {
        const user = userService.getUserById(1)

        await datedMockExpense(userService, categoryService, expenseService, new Date('August, 31, 2021'))
        await datedMockExpense(userService, categoryService, expenseService, new Date('October, 10, 2022'))
        await datedMockExpense(userService, categoryService, expenseService, new Date('December, 13, 2023'))
        await datedMockExpense(userService, categoryService, expenseService, new Date('December, 26, 2023'))

        const all_expenses = await expenseService.getAllExpenses()

        const expenses_in_2021 = await expenseService.getExpenseByParams({
            userId: 1,
            year: 2021
        })
        expect(expenses_in_2021.length).toBe(1)
        expect(expenses_in_2021[0]).toEqual(all_expenses[0])

        const expenses_in_2022 = await expenseService.getExpenseByParams({
            userId: 1,
            year: 2022
        })
        expect(expenses_in_2022.length).toBe(1)
        expect(expenses_in_2022[0]).toEqual(all_expenses[1])

        const expenses_in_2023 = await expenseService.getExpenseByParams({
            userId: 1,
            year: 2023
        })
        expect(expenses_in_2023.length).toBe(2)
        expect(expenses_in_2023[0]).toEqual(all_expenses[2])
        expect(expenses_in_2023[1]).toEqual(all_expenses[3])
    })

    afterEach(async () => cleanUp(prisma))
})

describe('Get expenses by category', () => {
    let expenseService: ExpenseService
    let userService: UserService
    let categoryService: CategoryService

    beforeEach(async () => {
        expenseService = new ExpenseService(prisma)
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)

        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
    })

    it("should return all of bob's expenses that are under a particular category", async () => {
        // Create mock expenses
        await categorizedMockExpense(userService, categoryService, expenseService, 2) // Entertainment
        await categorizedMockExpense(userService, categoryService, expenseService, 2) // Entertainment
        await categorizedMockExpense(userService, categoryService, expenseService, 1) // Food & Drink

        // Find expenses by category
        const entertainment_expenses = await expenseService.getExpenseByParams({
            userId: 1,
            categoryId: 2 // Entertainment
        })
        const foodndrink_expenses = await expenseService.getExpenseByParams({ // Created by different user
            userId: 2,
            categoryId: 1 // Food & Drink
        })

        expect(entertainment_expenses.length).toBe(2)
        expect(foodndrink_expenses.length).toBe(0)
    })

    afterEach(async () => cleanUp(prisma))
})

describe('Get expense by id', () => {
    let expenseService: ExpenseService
    let userService: UserService
    let categoryService: CategoryService

    beforeEach(async () => {
        expenseService = new ExpenseService(prisma)
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)

        await resetTables(prisma)

        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
    })

    it('should return undefined since there is no expense with id 1', async () => {
        const expense = await expenseService.getExpenseById(1)
        expect(expense).toBeNull()
    })

    it('should return the expense with id 1', async () => {
        // Ensure user & categories are succesfully initialized
        expect(await userService.getUserById(1)).not.toBeNull()
        expect(await categoryService.getCategoryById(2)).not.toBeNull()

        await addMockExpense(userService, categoryService, expenseService)

        const expense = await expenseService.getExpenseById(1)

        expect(expense).not.toBeNull()
        expect(expense?.id).toBe(1)
        expect(expense?.name).toBe("Cyberpunk 2077: Phantom Liberty")
    })

    afterEach(async () => await cleanUp(prisma))
})

describe('Get all expenses by user', () => {
    let expenseService: ExpenseService
    let userService: UserService
    let categoryService: CategoryService

    beforeEach(async () => {
        expenseService = new ExpenseService(prisma)
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)

        await resetTables(prisma)

        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
    })

    it('should return 3 expenses', async () => {
        await addMockExpense(userService, categoryService, expenseService)
        await addMockExpense(userService, categoryService, expenseService)
        await addMockExpense(userService, categoryService, expenseService)

        const expenses = await expenseService.getExpensesByUser(1)
        expect(expenses.length).toBe(3)
    })

    afterEach(async () => await cleanUp(prisma))
})