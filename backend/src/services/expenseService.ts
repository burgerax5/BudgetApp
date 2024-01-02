import { Currency } from "../models/Currency";
import { Expense } from "../models/Expense";
import { User } from "../models/User";
import { Category } from "../models/Category";

export class ExpenseServices {
    private expenses: Expense[]
    private next_id: number

    constructor() {
        this.expenses = []
        this.next_id = 0
    }

    getAllExpenses(): Expense[] {
        return this.expenses
    }

    public addExpense(user_id: number, currency: Currency, amount: number, name: string, date: Date, category: Category): boolean {
        const expense: Expense = { 
            expense_id: this.next_id++,
            user_id: user_id,
            currency,
            amount,
            name,
            date,
            category
        }

        const expenseExists: boolean = this.expenses.includes(expense)

        if (!expenseExists) {
            this.expenses.push(expense)
            return true
        } return false
    }

    public editExpense(original: Expense, 
        new_expense_details: {
            new_amount?: number, 
            new_date?: Date, 
            new_name?: string, 
            new_currency?: Currency,
            new_category?: Category
        }): void {

        const { new_amount, new_date, new_name, new_currency, new_category } = new_expense_details

        if (new_amount) {
            original.amount = new_amount
        }

        if (new_date) {
            original.date = new_date
        }

        if (new_name) {
            original.name = new_name
        }

        if (new_currency) {
            original.currency = new_currency
        }

        if (new_category) {
            original.category = new_category
        }
    }

    public deleteExpense(expense: Expense): boolean {
        const index = this.expenses.findIndex(exp => exp.expense_id === expense.expense_id)

        if (index > -1) {
            this.expenses = this.expenses.filter(exp => exp.expense_id !== expense.expense_id)
            return true
        }
        return false
    }

    getExpenseByUser(user: User): Expense[] {
        return this.expenses.filter(expense => expense.user_id === user.user_id)
    }
}