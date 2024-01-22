import { PrismaClient, Budget as PrismaBudget } from "@prisma/client"

interface Budget extends PrismaBudget { }

export class BudgetService {
    private prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async checkMonthBudgetSums(user_id: number, amount: number, month: number | undefined, year: number): Promise<boolean> {
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

    async checkYearBudgetSums(user_id: number, amount: number, month: number | undefined, year: number) {
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

    async checkBudgetEmpty(user_id: number, category_id: number | undefined, month: number | undefined, year: number): Promise<boolean> {
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
        categoryId: number | undefined,
        amount: number,
        month: number | undefined,
        year: number
    }): Promise<Budget | null> {
        const { categoryId, userId, amount, month, year } = budget_details

        // Make sure there isn't a budget for the user with the same date & category
        const budgetExists = await this.checkBudgetEmpty(userId, categoryId, month, year)
        // Make sure that the sum of the budget categories of the month doesn't exceed the budget for the month
        const withinMonthBudget = await this.checkMonthBudgetSums(userId, amount, month, year)
        // Make sure the sum of the categories and monthly budgets of the year doesn't exceed the budget for the month
        const withinYearBudget = await this.checkYearBudgetSums(userId, amount, month, year)

        // If the budget doesn't already exist add IFF it is a total budget (month or year) or it is a child budget within the parent budget
        if (!budgetExists && ((!month && !categoryId) || (month && !categoryId && withinYearBudget) || withinMonthBudget && withinYearBudget)) {
            return await this.prisma.budget.create({
                data: budget_details
            })
        } return null
    }

    async editBudget(budget_id: number, budget_details: {
        userId: number,
        categoryId: number | undefined,
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
