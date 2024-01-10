import {
    PrismaClient,
    Currency as PrismaCurrency,
    Expense as PrismaExpense,
    User as PrismaUser,
    Category as PrismaCategory
} from '@prisma/client'

interface Currency extends PrismaCurrency { }
interface Expense extends PrismaExpense { }
interface User extends PrismaUser { }
interface Category extends PrismaCategory { }

export class ExpenseService {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async getAllExpenses(): Promise<Expense[]> {
        return await this.prisma.expense.findMany()
    }

    async getExpenseById(expense_id: number): Promise<Expense | null> {
        return this.prisma.expense.findUnique({
            where: {
                id: expense_id
            }
        })
    }

    public async addExpense(expense_details: {
        user_id: number, currency: Currency, amount: number, name: string, date: Date, category: Category
    }) {
        await this.prisma.expense.create({
            data: {
                userId: expense_details.user_id,
                currencyId: expense_details.currency.id,
                amount: expense_details.amount,
                name: expense_details.name,
                date: expense_details.date,
                categoryId: expense_details.category.id,
            }
        })
    }

    // public editExpense(original: Expense,
    //     new_expense_details: {
    //         new_amount?: number,
    //         new_date?: Date,
    //         new_name?: string,
    //         new_currency?: Currency,
    //         new_category?: Category
    //     }): void {

    //     const { new_amount, new_date, new_name, new_currency, new_category } = new_expense_details

    //     if (new_amount) {
    //         original.amount = new_amount
    //     }

    //     if (new_date) {
    //         original.date = new_date
    //     }

    //     if (new_name) {
    //         original.name = new_name
    //     }

    //     if (new_currency) {
    //         original.currency = new_currency
    //     }

    //     if (new_category) {
    //         original.category = new_category
    //     }
    // }

    // public deleteExpense(expense: Expense): boolean {
    //     const index = this.expenses.findIndex(exp => exp.expense_id === expense.expense_id)

    //     if (index > -1) {
    //         this.expenses = this.expenses.filter(exp => exp.expense_id !== expense.expense_id)
    //         return true
    //     }
    //     return false
    // }

    // getExpenseByUser(user: User): Expense[] {
    //     return this.expenses.filter(expense => expense.user_id === user.user_id)
    // }

    // getUserExpenseByMonth(user: User, month: number, year: number): Expense[] {
    //     if (this.getExpenseByUser(user)) {
    //         const monthlyExpenses = this.expenses.filter(expense => {
    //             if (expense.date.getMonth() + 1 === month &&
    //                 expense.date.getFullYear() === year &&
    //                 expense.user_id === user.user_id) {
    //                 return expense
    //             }
    //         })
    //         return monthlyExpenses
    //     } return []
    // }

    // getUserExpenseByYear(user: User, year: number): Expense[] {
    //     if (this.getExpenseByUser(user)) {
    //         const yearlyExpenses = this.expenses.filter(expense => {
    //             if (expense.date.getFullYear() === year &&
    //                 expense.user_id === user.user_id) {
    //                 return expense
    //             }
    //         })
    //         return yearlyExpenses
    //     } return []
    // }

    // getUserExpenseByCategory(user: User, category: Category): Expense[] {
    //     if (this.getExpenseByUser(user)) {
    //         const categoryExpenses = this.expenses.filter(expense => {
    //             if (expense.category === category &&
    //                 expense.user_id === user.user_id) {
    //                 return expense
    //             }
    //         })
    //         return categoryExpenses
    //     } return []
    // }
}