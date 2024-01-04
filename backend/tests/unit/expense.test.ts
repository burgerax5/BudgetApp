import { ExpenseServices } from "../../src/services/expenseService";
import { Expense } from "../../src/models/Expense";
import { UserService } from "../../src/services/userService";
import { CategoryServices } from "../../src/services/categoryService";
import { jestRegister } from "../registerUser";
import { addMockExpense, datedMockExpense, categorizedMockExpense } from "../addExpense";
import { User } from "../../src/models/User";
import { Category } from "../../src/models/Category";

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
        const old_expenses = expenseService.getAllExpenses()
        expect(old_expenses.length).toBe(0)

        addMockExpense(userService, categoryService, expenseService)
        const new_expenses = expenseService.getAllExpenses()
        expect(new_expenses.length).toBe(1)
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

describe('Get expenses by month and year', () => {
    let expenseService: ExpenseServices
    let userService: UserService
    let categoryService: CategoryServices

    beforeEach(async () => {
        expenseService = new ExpenseServices()
        userService = new UserService()
        categoryService = new CategoryServices()
        await jestRegister('bob', 'password123', userService)
    })

    it("should return alice's expenses by month", () => {
        const user: User = userService.getAllUsers()[0]

        datedMockExpense(userService, categoryService, expenseService, new Date('August, 31, 2023'))
        datedMockExpense(userService, categoryService, expenseService, new Date('October, 10, 2023')) // Oct 2023
        datedMockExpense(userService, categoryService, expenseService, new Date('December, 13, 2023')) // Dec 2023
        datedMockExpense(userService, categoryService, expenseService, new Date('December, 26, 2023')) // Dec 2023

        const all_expenses: Expense[] = expenseService.getAllExpenses()

        const august: Expense[] = expenseService.getUserExpenseByMonth(user, 8, 2023)
        const october: Expense[] = expenseService.getUserExpenseByMonth(user, 10, 2023)
        const december: Expense[] = expenseService.getUserExpenseByMonth(user, 12, 2023)

        // Confirm correct number of expenses
        expect(august.length).toBe(1)
        expect(october.length).toBe(1)
        expect(december.length).toBe(2)

        // Confirm the validity of entries
        expect(august[0]).toBe(all_expenses[0])
        expect(october[0]).toBe(all_expenses[1])
        expect(december[0]).toBe(all_expenses[2])
        expect(december[1]).toBe(all_expenses[3])
    })

    it("should return all expenses from 2023", () => {
        const user: User = userService.getAllUsers()[0]

        datedMockExpense(userService, categoryService, expenseService, new Date('August, 31, 2021'))
        datedMockExpense(userService, categoryService, expenseService, new Date('October, 10, 2022'))
        datedMockExpense(userService, categoryService, expenseService, new Date('December, 13, 2023'))
        datedMockExpense(userService, categoryService, expenseService, new Date('December, 26, 2023'))

        const all_expenses: Expense[] = expenseService.getAllExpenses()

        const expenses_in_2021: Expense[] = expenseService.getUserExpenseByYear(user, 2021)
        expect(expenses_in_2021.length).toBe(1)
        expect(expenses_in_2021[0]).toBe(all_expenses[0])

        const expenses_in_2022: Expense[] = expenseService.getUserExpenseByYear(user, 2022)
        expect(expenses_in_2022.length).toBe(1)
        expect(expenses_in_2022[0]).toBe(all_expenses[1])

        const expenses_in_2023: Expense[] = expenseService.getUserExpenseByYear(user, 2023)
        expect(expenses_in_2023.length).toBe(2)
        expect(expenses_in_2023[0]).toBe(all_expenses[2])
        expect(expenses_in_2023[1]).toBe(all_expenses[3])
    })
})

describe('Get expenses by category', () => {
    let expenseService: ExpenseServices
    let userService: UserService
    let categoryService: CategoryServices

    beforeEach(async () => {
        expenseService = new ExpenseServices()
        userService = new UserService()
        categoryService = new CategoryServices()
        await jestRegister('bob', 'password123', userService)
    })
    
    it("should return all of bob's expenses that are under entertainment", () => {
        const user: User = userService.getAllUsers()[0]
        const entertainment = categoryService.getCategoryByName('Entertainment')
        const foodndrink = categoryService.getCategoryByName('Food & Drink')

        expect(entertainment).not.toBeUndefined()
        expect(foodndrink).not.toBeUndefined()

        if (entertainment && foodndrink) {
            categorizedMockExpense(userService, categoryService, expenseService, entertainment)
            categorizedMockExpense(userService, categoryService, expenseService, entertainment)
            categorizedMockExpense(userService, categoryService, expenseService, foodndrink)

            const all_expenses = expenseService.getAllExpenses()

            const entertainment_expenses = expenseService.getUserExpenseByCategory(user, entertainment)
            const foodndrink_expenses = expenseService.getUserExpenseByCategory(user, foodndrink)

            expect(entertainment_expenses.length).toBe(2)
            expect(foodndrink_expenses.length).toBe(1)
        }
    })
})