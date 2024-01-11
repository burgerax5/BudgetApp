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
        user_id: number,
        category_id: number,
        currency_id: number,
        amount: number,
        month: number | undefined,
        year: number
    }): Promise<Budget | null> {
        const { category_id, user_id, currency_id, amount, month, year } = budget_details

        // Make sure there isn't a budget for the user with the same date & category
        const budgetExists = await this.checkBudgetEmpty(user_id, category_id, month, year)
        if (!budgetExists) {
            return await this.prisma.budget.create({
                data: {
                    userId: user_id,
                    categoryId: category_id,
                    amount,
                    month,
                    year,
                    currencyId: currency_id
                }
            })
        } return null
    }

    // editBudget(budget_id: number, new_amount: number): budgetServiceReturn {
    //     const budget = this.getBudgetById(budget_id)

    //     if (budget) {
    //         budget.amount = new_amount
    //         return { success: true, budget: budget }
    //     } return { success: false, error: `No budget with the id ${budget_id}` }
    // }

    // deleteBudget(budget_id: number): budgetServiceReturn {
    //     const budget = this.getBudgetById(budget_id)

    //     if (budget) {
    //         this.budgets = this.budgets.filter(b => b.budget_id !== budget_id)
    //         return { success: true }
    //     } return { success: false, error: `No budget with the id ${budget_id}` }
    // }

    // getBudgetsByMonth(month: number, year: number): Budget[] {
    //     return this.budgets.filter(budget => budget.budget_month === month &&
    //         budget.budget_year === year)
    // }

    // getBudgetsByYear(year: number): Budget[] {
    //     return this.budgets.filter(budget => budget.budget_year === year)
    // }

    // getBudgetsByCategory(category: Category): Budget[] {
    //     return this.budgets.filter(budget => budget.category === category)
    // }
}
