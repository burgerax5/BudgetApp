import { PrismaClient, Budget as PrismaBudget } from "@prisma/client"

interface Budget extends PrismaBudget { }

export class BudgetService {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async getAllBudgets(): Promise<Budget[]> {
        return await this.prisma.budget.findMany()
    }

    async getBudgetsByUser(user_id: number): Promise<Budget[]> {
        return await this.prisma.budget.findMany({
            where: { userId: user_id }
        })
    }

    async getBudgetById(budget_id: number): Promise<Budget | null> {
        return await this.prisma.budget.findUnique({
            where: { id: budget_id }
        })
    }

    async checkBudgetEmpty(user_id: number, category_id: number, month: number | undefined, year: number): Promise<boolean> {
        // If there isn't already a budget set for the specified the category & date for the user
        const budget = await this.prisma.budget.findFirst({
            where: {
                userId: user_id,
                categoryId: category_id,
                month,
                year
            }
        })

        return budget ? true : false
    }

    async addBudget(budget_details: {
        userId: number,
        categoryId: number,
        currencyId: number,
        amount: number,
        month: number | undefined,
        year: number
    }): Promise<Budget | null> {
        const { categoryId, userId, currencyId, amount, month, year } = budget_details

        // Make sure there isn't a budget for the user with the same date & category
        const budgetExists = await this.checkBudgetEmpty(userId, categoryId, month, year)
        if (!budgetExists) {
            return await this.prisma.budget.create({
                data: budget_details
            })
        } return null
    }

    async editBudget(budget_id: number, budget_details: {
        userId: number,
        categoryId: number,
        currencyId: number,
        amount: number,
        month: number | undefined,
        year: number
    }): Promise<boolean> {
        const budgetExists = await this.prisma.budget.findUnique({
            where: { id: budget_id }
        })

        if (budgetExists) {
            await this.prisma.budget.update({
                data: budget_details,
                where: { id: budget_id }
            }); return true
        } return false
    }

    async deleteBudget(budget_id: number): Promise<boolean> {
        const budget = await this.getBudgetById(budget_id)
        if (!budget) return false

        await this.prisma.budget.delete({ where: { id: budget_id } })
        return true
    }

    async getBudgets(budget_details: {
        userId: number,
        categoryId?: number,
        month?: number,
        year?: number
    }): Promise<Budget[]> {
        const { userId, categoryId, month, year } = budget_details
        let where: any = { userId }

        if (categoryId)
            where.categoryId = categoryId

        if (month)
            where.month = month

        if (year)
            where.year = year

        return await this.prisma.budget.findMany({
            where: where
        })
    }
}
