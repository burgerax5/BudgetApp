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
    const category = categoryService.getCategoryByName('Entertainment')

    let isAdded: boolean = false

    if (user_id !== undefined && category) {
        isAdded = expenseService.addExpense(user_id, currency, amount, name, date, category)
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

    it('should increment the expense_id after each expense added', async () => {
        addMockExpense(userService, categoryService, expenseService)
        addMockExpense(userService, categoryService, expenseService)

        const all_expenses: Expense[] = expenseService.getAllExpenses()
        expect(all_expenses.length).toBe(2)

        expect(all_expenses[0].expense_id).toBe(0)
        expect(all_expenses[1].expense_id).toBe(1)
    })
})

describe('Test modifying existing expenses', () => {
    let expenseService: ExpenseServices
    let userService: UserService
    let categoryService: CategoryServices

    beforeEach(async () => {
        expenseService = new ExpenseServices()
        userService = new UserService()
        categoryService = new CategoryServices()
        await jestRegister('bob', 'password123', userService)
    })

    it('should remove an expense from the list', () => {
        addMockExpense(userService, categoryService, expenseService)

        let all_expenses = expenseService.getAllExpenses()    
        expect(all_expenses.length).toBe(1)

        let isDeleted: boolean = expenseService.deleteExpense(all_expenses[0])
        expect(isDeleted).toBeTruthy()
        
        all_expenses = expenseService.getAllExpenses()
        expect(all_expenses.length).toBe(0)
    })
    
    it('should modify the details of an expense', () => {
        addMockExpense(userService, categoryService, expenseService)
        const expenseToEdit: Expense = expenseService.getAllExpenses()[0]

        const new_amount = 109.00
        const new_name = "Final Fantasy VII Rebirth"
        const new_date = new Date()
        const new_expense_details = {
            new_amount, new_date, new_name
        }

        expenseService.editExpense(expenseToEdit, new_expense_details)
        const editedExpense: Expense = expenseService.getAllExpenses()[0]
        
        expect(editedExpense.currency).toEqual({"cc":"NZD","symbol":"NZ$","name":"New Zealand dollar"}) // Stays the same
        expect(editedExpense.amount).toBe(109.00)
        expect(editedExpense.name).toBe("Final Fantasy VII Rebirth")
        expect(editedExpense.date).toBe(new_date)
        expect(editedExpense.category.name).toBe("Entertainment") // Stays the same
    })
})