import { ExpenseServices } from "../../src/services/expenseService";
import { Expense } from "../../src/models/Expense";
import { UserService } from "../../src/services/userService";
import { CategoryServices } from "../../src/services/categoryService";
import { jestRegister } from "../registerUser";
import { Currency } from "../../src/models/Currency";
import { Category } from "../../src/models/Category";

function addMockExpense(userService: UserService, categoryService: CategoryServices, expenseService: ExpenseServices): boolean {
    // Parameters for expense
    const user_id = userService.getUserByUsername('bob')?.user_id
    const currency: Currency = {"cc":"NZD","symbol":"NZ$","name":"New Zealand dollar"}
    const amount = 49.99
    const name = "Cyberpunk 2077: Phantom Liberty"
    const date: Date = new Date()
    const category_id = categoryService.getCategoryByName('Entertainment')?.category_id

    let isAdded: boolean = false

    if (user_id !== undefined) {
        isAdded = expenseService.addExpense(user_id, currency, amount, name, date, category_id)
    } 
    return isAdded
}

describe('Test initialization and adding', () => {
    let expenseService: ExpenseServices
    let userService: UserService
    let categoryService: CategoryServices

    beforeEach(async () => {
        expenseService = new ExpenseServices()
        userService = new UserService()
        categoryService = new CategoryServices()
        await jestRegister('bob', 'password123', userService)
    })

    it('should initially be an empty list', () => {
        const all_expenses = expenseService.getAllExpenses()
        expect(all_expenses).toEqual([])
    })

    it('should add a new expense', async () => {
        const isAdded: boolean = addMockExpense(userService, categoryService, expenseService)
        expect(isAdded).toBeTruthy()
    })

    it('should add multiple expenses', async () => {
        addMockExpense(userService, categoryService, expenseService)
        addMockExpense(userService, categoryService, expenseService)
        expect(expenseService.getAllExpenses().length).toBe(2)
    })
})

describe('Test modifying existing expense', () => {

})