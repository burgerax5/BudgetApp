import { BudgetService } from "../../src/services/budgetService";
import { UserService } from "../../src/services/userService";
import { CategoryService } from "../../src/services/categoryService";
import { jestRegister } from "../scripts/registerUser";
import { prisma } from "../../src/services/service_init";
import { resetTables, cleanUp } from "../scripts/resetTables";

const budget_details = {
    userId: 1,
    categoryId: 2,
    amount: 49.99,
    month: 1,
    year: 2023
}

describe('Test adding budgets', () => {
    let userService: UserService
    let categoryService: CategoryService
    let budgetService: BudgetService

    beforeEach(async () => {
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)
        budgetService = new BudgetService(prisma)

        await resetTables(prisma)

        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
    })

    // FLAKY
    it('should add a budget for January 2023', async () => {
        expect(await userService.getUserById(1)).not.toBeNull()

        await budgetService.addBudget(budget_details)
        const budget = await budgetService.getBudgetById(1)
        expect(budget).not.toBeNull()

        expect(budget?.userId).toBe(1)
        expect(budget?.month).toBe(1)
        expect(budget?.year).toBe(2023)
    })

    // FLAKY
    // it('should not allow a user to have multiple budgets for the same category on the same date', async () => {
    //     const budget2_details = { ...budget_details, amount: 99.99 }

    //     expect(await budgetService.addBudget(budget_details)).not.toBeNull() // Adds
    //     expect(await budgetService.addBudget(budget2_details)).toBeNull() // Doesn't add

    //     const all_budgets = await budgetService.getAllBudgets()
    //     expect(all_budgets.length).toBe(1)
    // })

    afterAll(async () => await cleanUp(prisma))
})

describe('if the sum exceeds the monthly or yearly budget return false', () => {
    let userService: UserService
    let categoryService: CategoryService
    let budgetService: BudgetService

    beforeEach(async () => {
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)
        budgetService = new BudgetService(prisma)

        await resetTables(prisma)

        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
    })

    it('should return false if the months category budget will be exceed the monthly budget', async () => {
        // Get Jan 2024 total budget to be $50
        await budgetService.addBudget({ userId: 1, categoryId: undefined, amount: 50, month: 1, year: 2024 })

        // If we want to add a budget for a category that exceeds $50 then it should return false
        const withinBudget = await budgetService.checkMonthBudgetSums(1, 50.50, 1, 2024)
        expect(withinBudget).toBeFalsy()
    })

    it('should correctly sum up the budgets of the category then compare with the monthly budget', async () => {
        // Get Jan 2024 total budget to be $50
        await budgetService.addBudget({ userId: 1, categoryId: undefined, amount: 60, month: 1, year: 2024 })

        // Entertainment budget of $49.99
        await budgetService.addBudget(budget_details)

        // It should allow for another budget of $0.01
        const withinBudget = await budgetService.checkMonthBudgetSums(1, 0.01, 1, 2024)
        expect(withinBudget).toBeTruthy()
        await budgetService.addBudget({ ...budget_details, categoryId: 1, amount: 0.01 })

        // It should not allow anymore budgets to be added as it will exceed the monthly budget
        const withinBudget2 = await budgetService.checkMonthBudgetSums(1, 0.01, 3, 2024)
        expect(withinBudget2).toBeFalsy()
    })

    it('should return false if the montlhy budgets exceeds the yearly budget', async () => {
        // Get 2024 total budget to be $50
        await budgetService.addBudget({ userId: 1, categoryId: undefined, amount: 50, month: undefined, year: 2024 })

        // January budget to be $51
        const withinBudget = await budgetService.checkYearBudgetSums(1, 51, 1, 2024)
        expect(withinBudget).toBeFalsy()
    })

    it('Yearly category budgets', async () => {
        // Get 2024 budget to be $50
        await budgetService.addBudget({ userId: 1, categoryId: undefined, amount: 50, month: undefined, year: 2024 })

        // Add 2024 entertainment budget
        await budgetService.addBudget({ userId: 1, categoryId: 2, amount: 25, month: undefined, year: 2024 })

        // Add 2024 food & drink budget
        const withinBudget1 = await budgetService.checkYearBudgetSums(1, 26, undefined, 2024)
        expect(withinBudget1).toBeFalsy()

        const withinBudget2 = await budgetService.checkYearBudgetSums(1, 25, undefined, 2024)
        expect(withinBudget2).toBeTruthy()
    })
})

describe('Test editing & deleting budgets for a user', () => {
    let userService: UserService
    let categoryService: CategoryService
    let budgetService: BudgetService

    beforeEach(async () => {
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)
        budgetService = new BudgetService(prisma)

        await resetTables(prisma)

        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
    })

    // FLAKY
    it('should edit the price of the budget', async () => {
        const budget_before = await budgetService.addBudget(budget_details)
        expect(budget_before?.id).toBe(1)

        const budget_details2 = { ...budget_details, amount: 99.99 }
        const isEdited = await budgetService.editBudget(1, budget_details2)
        expect(isEdited).toBeTruthy()

        const budget_after = await budgetService.getBudgetById(1)
        expect(budget_after?.amount).toBe(99.99)
    })

    it('should return false if the budget to be edited does not exist', async () => {
        expect(await budgetService.editBudget(1, budget_details)).toBeFalsy()
    })

    it('should delete the budget with id of 1', async () => {
        const budget = await budgetService.addBudget(budget_details)
        expect(budget).not.toBeNull()

        const deleteSuccess = await budgetService.deleteBudget(1)
        expect(deleteSuccess).toBeTruthy()

        const budget_after = await budgetService.getBudgetById(1)
        expect(budget_after).toBeNull()
    })

    it('should return false when we try to delete an invalid budget', async () => {
        const deleteSuccess = await budgetService.deleteBudget(1)
        expect(deleteSuccess).toBeFalsy()
    })

    afterAll(async () => await cleanUp(prisma))
})

describe('Test getting budgets by user', () => {
    let userService: UserService
    let categoryService: CategoryService
    let budgetService: BudgetService

    beforeEach(async () => {
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)
        budgetService = new BudgetService(prisma)

        await resetTables(prisma)

        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
    })

    it('should return all budgets created by the user "bob"', async () => {
        await budgetService.addBudget(budget_details)
        await budgetService.addBudget({ ...budget_details, month: 2 })
        await budgetService.addBudget({ ...budget_details, month: 3 })

        const budgets = await budgetService.getBudgetsByUser(1)
        expect(budgets.length).toBe(3)
    })

    it('should return false since the user already has a budget for that category on that date', async () => {
        const { categoryId, month, year } = budget_details

        const budget = await budgetService.addBudget(budget_details)
        expect(budget).not.toBeNull()

        // Returns true if there exists a budget with the specified category, month, and year
        const isExist1 = await budgetService.checkBudgetEmpty(1, categoryId, month, year)
        expect(isExist1).toBeTruthy()

        // Altering either of the category, month, or year will return false
        const isExist2 = await budgetService.checkBudgetEmpty(1, categoryId, month, year + 1)
        expect(isExist2).toBeFalsy()
    })

    afterAll(async () => await cleanUp(prisma))
})

describe('Retrieve budgets by the user in a given category/month/year', () => {
    let userService: UserService
    let categoryService: CategoryService
    let budgetService: BudgetService

    beforeEach(async () => {
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)
        budgetService = new BudgetService(prisma)

        await resetTables(prisma)

        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
    })

    it('should return 2 budgets from Jan 2023', async () => {
        await budgetService.addBudget(budget_details)
        await budgetService.addBudget({ ...budget_details, categoryId: 1 })
        await budgetService.addBudget({ ...budget_details, month: 3 })

        const budgetsFromJan2023 = await budgetService.getBudgets({ userId: 1, month: 1, year: 2023 })
        expect(budgetsFromJan2023.length).toBe(2)
    })

    it('should return 2 budgets from 2023', async () => {
        await budgetService.addBudget(budget_details)
        await budgetService.addBudget({ ...budget_details, month: 2 })
        await budgetService.addBudget({ ...budget_details, year: 2024 })

        const budgetsFrom2023 = await budgetService.getBudgets({ userId: 1, year: 2023 })
        expect(budgetsFrom2023.length).toBe(2)
    })

    it('should return 0 budgets from 2025', async () => {
        await budgetService.addBudget(budget_details)
        const budgetsFrom2025 = await budgetService.getBudgets({ userId: 1, year: 2015 })
        expect(budgetsFrom2025.length).toBe(0)
    })

    it('should return 2 budgets from the entertainment category and 1 from food & drink', async () => {
        await budgetService.addBudget(budget_details) // Entertainment
        await budgetService.addBudget({ ...budget_details, categoryId: 1 }) // Food & Drink
        await budgetService.addBudget({ ...budget_details, year: 2024 }) // Entertainment

        const budgetsFromEntertainment = await budgetService.getBudgets({ userId: 1, categoryId: 2 })
        expect(budgetsFromEntertainment.length).toBe(2)

        const budgetsFromFoodNDrink = await budgetService.getBudgets({ userId: 1, categoryId: 1 })
        expect(budgetsFromFoodNDrink.length).toBe(1)
    })

    afterAll(async () => await cleanUp(prisma))
})