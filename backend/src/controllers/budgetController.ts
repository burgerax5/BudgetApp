import { Request, Response } from 'express';

import { User } from '../models/User';
import { Budget } from 'src/models/Budget';
import { Category } from 'src/models/Category';

import { BudgetServices } from '../services/budgetService';
import { UserService } from '../services/userService';
import { CategoryServices } from '../services/categoryService';

import { currencies } from '../constants/currencies';

export class BudgetController {
    private budgetService: BudgetServices
    private userService: UserService
    private categoryService: CategoryServices

    constructor(budgetService: BudgetServices, userService: UserService) {
        this.budgetService = budgetService
        this.userService = userService
        this.categoryService = new CategoryServices()
    }

    private checkBudgetExists(user: User, budget: {
        category: Category | undefined;
        amount: number;
        budget_month: number | undefined;
        budget_year: number;
    }): Boolean {
        const { category, budget_month: month, budget_year: year } = budget

        // Total budget for the month
        if (!category && month && year) {
            const monthly_budgets = this.budgetService.getBudgetsByMonth(month, year)
            
            return monthly_budgets.some(budget => !budget.category && budget.budget_month === month &&
                budget.budget_year === year && budget.user.user_id === user.user_id)
        }

        // Total budget for the year
        if (!category && !month && year) {
            const yearly_budgets = this.budgetService.getBudgetsByYear(year)

            return yearly_budgets.some(budget => budget.budget_year === year &&
                !budget.budget_month && !budget.category && budget.user.user_id === user.user_id)
        }

        // Categorical budget for the month
        if (category && month && year) {
            const monthly_budgets = this.budgetService.getBudgetsByMonth(month, year)

            return monthly_budgets.some(budget => budget.category === category &&
                budget.budget_month === month &&
                budget.budget_year === year && budget.user.user_id === user.user_id)
        }

        // Categorical budget for the year
        if (category && !month && year) {
            const yearly_budgets = this.budgetService.getBudgetsByYear(year)

            return yearly_budgets.some(budget => budget.category === category &&
                !budget.budget_month && budget.budget_year === year && budget.user.user_id === user.user_id)
        }

        return false
    }

    getBudgetByUser(req: Request, res: Response) {
        try{
            let month: unknown = req.query.month
            let year: unknown = req.query.year
            const userId = req.params.userId

            const user = this.userService.getUserById(parseInt(userId))

            if (!user) {
                throw new Error('User does not exist.')
            }

            let budgets: Budget[]

            if (typeof year === 'string' && typeof month === 'string') {
                const m: number = parseInt(month)
                const y: number = parseInt(year)

                budgets = this.budgetService.getBudgetsByMonth(m, y)
                res.status(200).send(budgets)
                return
            } else if (typeof year === 'string') {
                const y: number = parseInt(year)

                budgets = this.budgetService.getBudgetsByYear(y)
                res.status(200).json({
                    user: user.username,
                    budgets
                })
                return
            }else {
                throw new Error('A year must be provided')
            }

            
        } catch (error) {
            console.error(`An error occurred while retrieving budget`, error)
            res.status(500).send('Internal Server Error')
        }
    }

    addBudget(req: Request, res: Response) {
        try {
            const user = req.body.user
            const { category_name, amount, month, year } = req.body

            const category = this.categoryService.getCategoryByName(category_name)
            const budget_amount = parseInt(amount)
            let budget_month: number | undefined = undefined
            const budget_year = parseInt(year)

            if (month) {
                budget_month = parseInt(month)
            }

            const budget_details = {
                category,
                amount: budget_amount,
                budget_month,
                budget_year
            }

            if (!user) {
                throw new Error(`User does not exist. ${req.body.user}`)
            }
            
            if (!budget_amount || !budget_year) {
                throw new Error('Missing details; requires budget amount and year')
            }

            if (this.checkBudgetExists(user, budget_details)) {
                throw new Error('Budget already exists.')
            }

            this.budgetService.addBudget(user, budget_details)
            res.status(200).json({
                'succcess': true,
                'message': 'Successfully added budget'
            })

        } catch (error) {
            console.error(`An error occurred while adding a budget: `, error)
            res.status(500).send('Internal Server Error')
        }
    }
}