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
        user_id: number, currency_id: number, amount: number, name: string, date: Date, category_id: number
    }): Promise<Expense> {
        return await this.prisma.expense.create({
            data: {
                user: {
                    connect: { id: expense_details.user_id }
                },
                currency: {
                    connect: { id: expense_details.currency_id }
                },
                amount: expense_details.amount,
                name: expense_details.name,
                date: expense_details.date,
                category: {
                    connect: { id: expense_details.category_id }
                }
            }
        });
    }

    public async editExpense(expense_id: number,
        new_expense_details: {
            new_amount?: number,
            new_date?: Date,
            new_name?: string,
            new_currency_id?: number,
            new_category_id?: number
        }): Promise<void> {

        const { new_amount, new_date, new_name, new_currency_id, new_category_id } = new_expense_details

        await this.prisma.expense.update({
            data: {
                amount: new_amount,
                date: new_date,
                name: new_name,
                currencyId: new_currency_id,
                categoryId: new_category_id
            },
            where: {
                id: expense_id
            }
        })
    }

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