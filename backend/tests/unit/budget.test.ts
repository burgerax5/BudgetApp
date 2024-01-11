import { BudgetService } from "../../src/services/budgetService";
import { UserService } from "../../src/services/userService";
import { CategoryService } from "../../src/services/categoryService";
import { jestRegister } from "../scripts/registerUser";
import { prisma } from "../../src/services/service_init";
import { CurrencyService } from "../../src/services/currencyService";
import { resetTables, cleanUp } from "../scripts/resetTables";

describe('Test adding budgets', () => {
    let userService: UserService
    let categoryService: CategoryService
    let budgetService: BudgetService
    let currencyService: CurrencyService

    beforeEach(async () => {
        userService = new UserService(prisma)
        categoryService = new CategoryService(prisma)
        budgetService = new BudgetService(prisma)
        currencyService = new CurrencyService(prisma)

        await resetTables(prisma)

        await jestRegister('bob', 'password123', userService)
        await categoryService.populate_categories()
        await currencyService.populate_currencies()
    })

    it('should add a budget for January 2023', async () => {
        const budget_details = {
            user_id: 1,
            category_id: 2,
            currency_id: 106,
            amount: 49.99,
            month: 1,
            year: 2023
        }

        expect(await userService.getUserById(1)).not.toBeNull()

        await budgetService.addBudget(budget_details)
        const budget = await budgetService.getBudgetById(1)
        expect(budget).not.toBeNull()

        expect(budget?.userId).toBe(1)
        expect(budget?.month).toBe(1)
        expect(budget?.year).toBe(2023)
    })

    it('should not allow a user to have multiple budgets for the same category on the same date', async () => {
        const budget1_details = {
            user_id: 1,
            category_id: 2,
            currency_id: 106,
            amount: 49.99,
            month: 1,
            year: 2023
        }

        const budget2_details = { ...budget1_details, amount: 99.99 }

        expect(await budgetService.addBudget(budget1_details)).not.toBeNull() // Adds
        expect(await budgetService.addBudget(budget2_details)).toBeNull() // Doesn't add

        const all_budgets = await budgetService.getAllBudgets()
        expect(all_budgets.length).toBe(1)
    })

    afterEach(async () => cleanUp(prisma))
})

// describe('Test editing & deleting budgets for a user', () => {
//     let userService: UserService
//     let categoryService: CategoryServices
//     let budgetService: BudgetServices
//     let user: User

//     beforeEach(async () => {
//         userService = new UserService()
//         categoryService = new CategoryServices()
//         budgetService = new BudgetServices()
//         user = userService.getAllUsers()[0]
//         await jestRegister('bob', 'password123', userService)
//     })

//     it('should modify the price of the budget', () => {
//         const budget1 = {
//             category: categoryService.getCategoryByName('Entertainment'),
//             amount: 49.99,
//             budget_month: 2,
//             budget_year: 2023
//         }

//         const { success, budget } = budgetService.addBudget(user, budget1)

//         expect(budget?.budget_id).not.toBeUndefined()

//         if (budget?.budget_id !== undefined) {
//             budgetService.editBudget(budget?.budget_id, 99.99)
//         }

//         expect(budget?.amount).toBe(99.99)
//     })

//     it('should return an error saying that the there is no budget with id 1', () => {
//         const { success, error, budget } = budgetService.editBudget(1, 50.00)

//         expect(success).toBeFalsy()
//         expect(error).toBe("No budget with the id 1")
//         expect(budget).toBeUndefined()
//     })

//     it('should remove the budget with id of 0', () => {
//         const budget1_details = {
//             category: categoryService.getCategoryByName('Entertainment'),
//             amount: 49.99,
//             budget_month: 2,
//             budget_year: 2023
//         }

//         const { success, budget } = budgetService.addBudget(user, budget1_details)
//         expect(success).toBeTruthy()
//         expect(budget?.budget_id).toBe(0)

//         if (budget) {
//             const { success: deleteSuccess } = budgetService.deleteBudget(budget?.budget_id) 
//             expect(deleteSuccess).toBeTruthy()
//         }
//     })

//     it('should return an error when we try deleting a budget with id 1', () => {
//         const { success: deleteSuccess } = budgetService.deleteBudget(1) 
//         expect(deleteSuccess).toBeFalsy()
//     })
// })

// describe('Test getting budgets by user', () => {
//     let userService: UserService
//     let categoryService: CategoryServices
//     let budgetService: BudgetServices
//     let user: User

//     beforeEach(async () => {
//         userService = new UserService()
//         categoryService = new CategoryServices()
//         budgetService = new BudgetServices()
//         user = userService.getAllUsers()[0]
//         await jestRegister('bob', 'password123', userService)
//     })

//     it('should return all budgets created by the user "alice"', () => {
//         const budget_detail_template = {
//             category: categoryService.getCategoryByName('Entertainment'),
//             amount: 49.99,
//             budget_month: 2,
//             budget_year: 2023
//         }
    
//         budgetService.addBudget(user, budget_detail_template)
//         budgetService.addBudget(user, {...budget_detail_template, budget_year: 2022})
//         budgetService.addBudget(user, {...budget_detail_template, budget_year: 2021})

//         const budgets = budgetService.getBudgetByUser(user)
//         expect(budgets.length).toBe(3)
//     })

//     it('should return false since the user already has a budget for that category on that date', () => {
//         const budget_detail_template = {
//             category: categoryService.getCategoryByName('Entertainment'),
//             amount: 49.99,
//             budget_month: 2,
//             budget_year: 2023
//         }

//         const { category, budget_month, budget_year } = budget_detail_template
    
//         budgetService.addBudget(user, budget_detail_template)
//         const isExist = budgetService.checkBudgetEmpty(user, category, budget_month, budget_year)
//         expect(isExist).toBeTruthy()
//     })
// })