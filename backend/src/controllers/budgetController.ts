import { Request, Response } from 'express';

import { BudgetService } from '../services/budgetService';
import { UserService } from '../services/userService';

export class BudgetController {
    private budgetService: BudgetService
    private userService: UserService

    constructor(budgetService: BudgetService, userService: UserService) {
        this.budgetService = budgetService
        this.userService = userService
    }

    async getBudgets(req: Request, res: Response) {
        try {
            const { month, year, categoryId } = req.query
            const userId = parseInt(req.body.user.user_id as string, 10)
            const user = await this.userService.getUserById(userId)

            if (!user)
                throw new Error('User does not exist.')

            let budget_details: {
                userId: number,
                categoryId?: number,
                month?: number,
                year?: number
            } = { userId }

            if (!isNaN(parseInt(month as string, 10)))
                budget_details.month = parseInt(month as string, 10)

            if (!isNaN(parseInt(year as string, 10)))
                budget_details.year = parseInt(year as string, 10)

            if (!isNaN(parseInt(categoryId as string, 10)))
                budget_details.categoryId = parseInt(categoryId as string, 10)

            const budgets = await this.budgetService.getBudgets(budget_details)
            res.status(200).json({
                budgets
            })
        } catch (error) {
            console.error(`An error occurred while retrieving budget`, error)
            res.status(500).send('Internal Server Error')
        }
    }

    async addBudget(req: Request, res: Response) {
        try {
            const user_id = req.body.user.user_id
            const user = this.userService.getUserById(user_id)
            const { categoryId, amount, month, year } = req.body

            if (!user)
                throw new Error('User does not exist')

            const budgetExists = await this.budgetService.checkBudgetEmpty(user_id, categoryId, month, year)
            if (budgetExists) {
                res.status(400).json({
                    'success': false,
                    'message': 'Budget already exists'
                })
            } else {
                const budget = await this.budgetService.addBudget({
                    userId: user_id,
                    categoryId,
                    amount,
                    month,
                    year
                })

                if (!budget)
                    return res.status(400).send('Failed to add budget due to parent budget being exceeded.')

                res.status(200).json({
                    'succcess': true,
                    'message': 'Successfully added budget.',
                    'budget': budget
                })
            }

        } catch (error) {
            console.error(`An error occurred while adding a budget: `, error)
            res.status(500).send('Internal Server Error')
        }
    }

    async editBudget(req: Request, res: Response) {
        try {
            const user_id = req.body.user.user_id
            const user = await this.userService.getUserById(user_id)

            if (!user)
                throw new Error('User does not exist.')

            const budget_id = parseInt(req.params.budgetId)
            const budget = await this.budgetService.getBudgetById(budget_id)

            if (!budget)
                throw new Error('Budget does not exist.')

            if (user_id !== budget.userId)
                throw new Error('User id does not match owner of budget id')

            const budget_amount = parseInt(req.body.amount as string, 10)

            if (isNaN(budget_amount))
                throw new Error('Must supply a budget amount as a number')

            await this.budgetService.editBudget(budget_id, {
                userId: user_id,
                categoryId: budget.categoryId ? budget.categoryId : undefined,
                amount: budget_amount,
                month: budget.month ? budget.month : undefined,
                year: budget.year
            })
            res.status(200).send({ message: 'Successfully edited budget.' })

        } catch (error) {
            console.error('Error occured while editing budget', error)
            res.status(500).send('Internal Server Error')
        }
    }

    async deleteBudget(req: Request, res: Response) {
        try {
            const username = req.body.user.username
            const user = await this.userService.getUserByUsername(username)

            if (!user)
                throw new Error('User does not exist')

            const budget_id = parseInt(req.params.budgetId as string, 10)
            const budget = await this.budgetService.getBudgetById(budget_id)

            if (!budget)
                throw new Error('Budget does not exist')

            if (user.id !== budget.userId)
                throw new Error('User id does not match owner of budget id')

            await this.budgetService.deleteBudget(budget_id)
            res.status(200).send({ message: 'Successfully deleted a budget.' })

        } catch (error) {
            console.error('An error occurred while deleting a budget', error)
            res.status(500).send('Internal Server Error')
        }
    }
}