import { PrismaClient, Budget as PrismaBudget } from "@prisma/client"

interface Budget extends PrismaBudget { }

export class BudgetService {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async checkMonthBudgetSums(user_id: string, amount: number, month: number | undefined, year: number): Promise<boolean> {
        const budgets = await this.prisma.budget.findMany({
            where: { userId: user_id, month, year }
        })

        let monthsBudgetSums = { categories: 0, total: 0 }

        budgets.map(budget => {
            if (budget.month && !budget.categoryId) // Month total budget
                monthsBudgetSums.total = budget.amount

            if (budget.month && budget.categoryId) // Months budget for a category
                monthsBudgetSums.categories += budget.amount
        })

        return monthsBudgetSums.categories + amount <= monthsBudgetSums.total
    }

    async checkYearBudgetSums(user_id: string, amount: number, month: number | undefined, year: number | undefined) {
        if (!year) return true

        const budgets = await this.prisma.budget.findMany({
            where: { userId: user_id, year }
        })

        let yearBudgetSums = { categories: 0, months: 0, total: 0 }

        budgets.map(budget => {
            if (!budget.month && !budget.categoryId) // Year total budget
                yearBudgetSums.total = budget.amount

            if (!budget.month && budget.categoryId) // Years budget for a category
                yearBudgetSums.categories += budget.amount

            if (budget.month && !budget.categoryId) // Years budget for a month
                yearBudgetSums.months += budget.amount
        })

        if (month) yearBudgetSums.months += amount
        else yearBudgetSums.categories += amount

        if (month) return yearBudgetSums.months <= yearBudgetSums.total // If we're adding a monthly budget
        return yearBudgetSums.categories <= yearBudgetSums.total // If we're adding a category budget
    }

    async getAllBudgets(): Promise<Budget[]> {
        return await this.prisma.budget.findMany()
    }

    async getBudgetsByUser(user_id: string): Promise<Budget[]> {
        return await this.prisma.budget.findMany({
            where: { userId: user_id }
        })
    }

    async getBudgetById(budget_id: string): Promise<Budget | null> {
        return await this.prisma.budget.findUnique({
            where: { id: budget_id }
        })
    }

    async checkBudgetEmpty(user_id: string, category_id: string | undefined, month: number | undefined, year: number): Promise<boolean> {
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
        userId: string,
        categoryId: string | undefined,
        amount: number,
        month: number | undefined,
        year: number
    }): Promise<Budget | null> {
        return await this.prisma.budget.create({
            data: budget_details
        })
    }

    async editBudget(budget_id: string, budget_details: {
        userId: string,
        categoryId: string | undefined,
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

    async deleteBudget(budget_id: string): Promise<boolean> {
        const budget = await this.getBudgetById(budget_id)
        if (!budget) return false

        await this.prisma.budget.delete({ where: { id: budget_id } })
        return true
    }

    async getBudgets(budget_details: {
        userId: string,
        categoryId?: string,
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
