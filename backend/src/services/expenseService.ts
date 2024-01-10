// import { Currency } from "../models/Currency";
// import { Expense } from "../models/Expense";
// import { User } from "../models/User";
// import { Category } from "../models/Category";

// export class ExpenseServices {
//     private expenses: Expense[]
//     private next_id: number

//     constructor() {
//         this.expenses = []
//         this.next_id = 0
//     }

//     getAllExpenses(): Expense[] {
//         return this.expenses
//     }

//     getExpenseById(expense_id: number): Expense | undefined {
//         return this.expenses.find(expense => expense.expense_id === expense_id)
//     }

//     public addExpense(expense_details: {
//         user_id: number, currency: Currency, amount: number, name: string, date: Date, category: Category
//     }) {
//         const expense: Expense = {
//             expense_id: this.next_id++,
//             user_id: expense_details.user_id,
//             currency: expense_details.currency,
//             amount: expense_details.amount,
//             name: expense_details.name,
//             date: expense_details.date,
//             category: expense_details.category
//         }

//         this.expenses.push(expense)
//     }

//     public editExpense(original: Expense,
//         new_expense_details: {
//             new_amount?: number,
//             new_date?: Date,
//             new_name?: string,
//             new_currency?: Currency,
//             new_category?: Category
//         }): void {

//         const { new_amount, new_date, new_name, new_currency, new_category } = new_expense_details

//         if (new_amount) {
//             original.amount = new_amount
//         }

//         if (new_date) {
//             original.date = new_date
//         }

//         if (new_name) {
//             original.name = new_name
//         }

//         if (new_currency) {
//             original.currency = new_currency
//         }

//         if (new_category) {
//             original.category = new_category
//         }
//     }

//     public deleteExpense(expense: Expense): boolean {
//         const index = this.expenses.findIndex(exp => exp.expense_id === expense.expense_id)

//         if (index > -1) {
//             this.expenses = this.expenses.filter(exp => exp.expense_id !== expense.expense_id)
//             return true
//         }
//         return false
//     }

//     getExpenseByUser(user: User): Expense[] {
//         return this.expenses.filter(expense => expense.user_id === user.user_id)
//     }

//     getUserExpenseByMonth(user: User, month: number, year: number): Expense[] {
//         if (this.getExpenseByUser(user)) {
//             const monthlyExpenses = this.expenses.filter(expense => {
//                 if (expense.date.getMonth() + 1 === month &&
//                     expense.date.getFullYear() === year &&
//                     expense.user_id === user.user_id) {
//                     return expense
//                 }
//             })
//             return monthlyExpenses
//         } return []
//     }

//     getUserExpenseByYear(user: User, year: number): Expense[] {
//         if (this.getExpenseByUser(user)) {
//             const yearlyExpenses = this.expenses.filter(expense => {
//                 if (expense.date.getFullYear() === year &&
//                     expense.user_id === user.user_id) {
//                     return expense
//                 }
//             })
//             return yearlyExpenses
//         } return []
//     }

//     getUserExpenseByCategory(user: User, category: Category): Expense[] {
//         if (this.getExpenseByUser(user)) {
//             const categoryExpenses = this.expenses.filter(expense => {
//                 if (expense.category === category &&
//                     expense.user_id === user.user_id) {
//                     return expense
//                 }
//             })
//             return categoryExpenses
//         } return []
//     }
// }