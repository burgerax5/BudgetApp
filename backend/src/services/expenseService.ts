import { Currency } from "../models/Currency";
import { Expense } from "../models/Expense";
import { User } from "../models/User";

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

    public addExpense(user_id: number, currency: Currency, amount: number, name: string, date: Date, category_id: number | undefined): boolean {
        const expense: Expense = { 
            expense_id: this.next_id++,
            user_id: user_id,
            currency,
            amount,
            name,
            date,
            category_id
        }

        const expenseExists: boolean = this.expenses.includes(expense)

        if (!expenseExists) {
            this.expenses.push(expense)
            return true
        } return false
    }

    public editExpense(original: Expense, newExpense: Expense): void {
        original.amount = newExpense.amount
        original.date = newExpense.date
        original.name = newExpense.name
        original.currency = newExpense.currency
    }

    public deleteExpense(expense: Expense): boolean {
        const index = this.expenses.findIndex(exp => exp.expense_id === expense.expense_id)

        if (index > -1) {
            this.expenses = this.expenses.filter(exp => exp.category_id !== expense.expense_id)
            return true
        }
        return false
    }

    getExpenseByUser(user: User): Expense[] {
        return this.expenses.filter(expense => expense.user_id === user.user_id)
    }
}

// import { Category } from "../models/Category";

// export class CategoryServices {
//     private categories: Category[]

//     constructor() {
//         this.categories = [
//             {category_id: 0, name: "Food & Drink", colour: "#f5b642"},
//             {category_id: 1, name: "Entertainment", colour: "#f54e42"},
//             {category_id: 2, name: "Transportation", colour: "#dd42f5"},
//             {category_id: 3, name: "Health", colour: "#54f542"},
//             {category_id: 4, name: "Groceries", colour: "#ba4111"},
//             {category_id: 5, name: "Education", colour: "#11bab2"},
//             {category_id: 6, name: "Housing", colour: "#ba115a"}
//         ]
//     }

//     public getAllCategories(): Category[] {
//         return this.categories
//     }

//     public getCategoryByName(category_name: string): Category | undefined {
//         return this.categories.find(category => category.name === category_name)
//     }
// }