import {
    PrismaClient,
    Expense as PrismaExpense,
    User as PrismaUser,
    Category as PrismaCategory
} from '@prisma/client'

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

    async getExpenseByParams(where: {
        userId: number,
        name?: string,
        month?: number,
        year?: number,
        categoryId?: number,
    }, take: number | undefined): Promise<Expense[]> {
        return this.prisma.expense.findMany({
            where,
            take,
            orderBy: [
                { day: 'desc' },
                { month: 'desc' },
                { year: 'desc' }
            ]
        })
    }

    public async addExpense(expense_details: {
        userId: number,
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
            amount: number,
            day: number,
            month: number,
            year: number,
            name: string,
            categoryId: number
        }): Promise<void> {

        const { amount, day, month, year, name, categoryId } = new_expense_details

        await this.prisma.expense.update({
            data: {
                amount,
                day,
                month,
                year,
                name,
                categoryId
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
}