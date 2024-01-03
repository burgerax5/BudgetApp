import { Budget } from "../models/Budget"
import { User } from "../models/User"
import { Category } from "../models/Category"

export interface budgetServiceReturn {
    success: boolean,
    budget?: Budget,
    error?: string
}

export class BudgetServices {
    private budgets: Budget[]
    private next_budget_id

    constructor() {
        this.budgets = []
        this.next_budget_id = 0
    }

    getAllBudgets(): Budget[] {
        return this.budgets
    }

    getBudgetByUser(user: User): Budget[] {
        return this.budgets.filter(budget => budget.user === user)
    }

    getBudgetById(budget_id: number): Budget | undefined {
        return this.budgets.find(budget => budget.budget_id === budget_id)
    }

    checkBudgetEmpty(user: User, category: Category | undefined, month: number | undefined, year: number): boolean {
        // If there isn't already a budget set for the specified the category & date for the user
        return this.budgets.some(budget => {
            if (category) {
                return budget.budget_month === month 
                && budget.budget_year === year 
                && budget.user === user
                && budget.category === category
            } return false
        })
    }

    addBudget(user: User, budget_details: {
        category: Category | undefined,
        amount: number,
        budget_month: number | undefined,
        budget_year: number
    }): budgetServiceReturn {
        const { category, amount, budget_month, budget_year } = budget_details

        const new_budget: Budget = {
            budget_id: this.next_budget_id++,
            user,
            ...budget_details
        }

        // Make sure there isn't a budget for the user with the same date & category
        if (!this.checkBudgetEmpty(user, category, budget_month, budget_year)) {
            this.budgets.push(new_budget)
            return { success: true, budget: new_budget }
        } return { success: false, error: "Budget not found" }
    }

    editBudget(budget_id: number, new_amount: number): budgetServiceReturn {
        const budget = this.getBudgetById(budget_id)

        if (budget) {
            budget.amount = new_amount
            return { success: true, budget: budget }
        } return { success: false, error: `No budget with the id ${budget_id}` }
    }

    deleteBudget(budget_id: number): budgetServiceReturn {
        const budget = this.getBudgetById(budget_id)

        if (budget) {
            this.budgets = this.budgets.filter(b => b.budget_id !== budget_id)
            return { success: true }
        } return { success: false, error: `No budget with the id ${budget_id}` }
    }
}
