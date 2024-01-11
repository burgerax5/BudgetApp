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
        userId: number,
        currencyId: number,
        amount: number,
        name: string,
        day: number,
        month: number,
        year: number,
        categoryId: number
    }): Promise<Expense | null> {
        return await this.prisma.expense.create({
            data: {
                user: {
                    connect: { id: expense_details.userId }
                },
                currency: {
                    connect: { id: expense_details.currencyId }
                },
                amount: expense_details.amount,
                name: expense_details.name,
                day: expense_details.day,
                month: expense_details.month,
                year: expense_details.year,
                category: {
                    connect: { id: expense_details.categoryId }
                }
            }
        });
    }

    public async editExpense(expense_id: number,
        new_expense_details: {
            new_amount: number,
            new_day: number,
            new_month: number,
            new_year: number,
            new_name: string,
            new_currency_id: number,
            new_category_id: number
        }): Promise<void> {

        const { new_amount, new_day, new_month, new_year, new_name, new_currency_id, new_category_id } = new_expense_details

        await this.prisma.expense.update({
            data: {
                amount: new_amount,
                day: new_day,
                month: new_month,
                year: new_year,
                name: new_name,
                currencyId: new_currency_id,
                categoryId: new_category_id
            },
            where: {
                id: expense_id
            }
        })
    }

    public async deleteExpense(expense_id: number): Promise<void> {
        await this.prisma.expense.delete({
            where: { id: expense_id }
        })
    }

    async getExpensesByUser(user_id: number): Promise<Expense[]> {
        return await this.prisma.expense.findMany({
            where: { userId: user_id }
        })
    }

    async getUserExpenseByMonth(user_id: number, month: number, year: number): Promise<Expense[]> {
        return await this.prisma.expense.findMany({
            where: {
                userId: user_id,
                month,
                year
            }
        })
    }

    async getUserExpenseByYear(user_id: number, year: number): Promise<Expense[]> {
        return await this.prisma.expense.findMany({
            where: {
                userId: user_id,
                year
            }
        })
    }

    async getUserExpenseByCategory(user_id: number, category_id: number): Promise<Expense[]> {
        return await this.prisma.expense.findMany({
            where: {
                userId: user_id,
                categoryId: category_id
            }
        })
    }
}