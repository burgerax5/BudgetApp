import { Request, Response } from 'express';

import { ExpenseService } from '../services/expenseService';
import { UserService } from '../services/userService';
import { CategoryService } from '../services/categoryService';
import { PrismaClient, User as PrismaUser, Currency as PrismaCurrency } from '@prisma/client';

interface User extends PrismaUser { }
interface Currency extends PrismaCurrency { }

import { prisma } from '../services/service_init';
import { CurrencyService } from '../services/currencyService';

export class ExpenseController {
    private expenseService: ExpenseService
    private userService: UserService
    private categoryService: CategoryService
    private currencyService: CurrencyService

    constructor(expenseService: ExpenseService, userService: UserService, currencyService: CurrencyService) {
        this.expenseService = expenseService
        this.userService = userService
        this.currencyService = currencyService
        this.categoryService = new CategoryService(prisma)
    }

    private async getUserFromRequest(req: Request): Promise<User | null> {
        const user = await this.userService.getUserByUsername(req.body.user.username);
        if (!user) {
            throw new Error(`No user with the details ${JSON.stringify(req.body.user)}`);
        }
        return user;
    }

    private async getCurrency(code: string): Promise<Currency | null> {
        return await this.currencyService.getCategoryByCode(code)
    }

    private async getUserFromParam(req: Request): Promise<User | null> {
        const userId = parseInt(req.params.userId)
        const user = await this.userService.getUserById(userId)
        return user
    }

    async getExpenseById(req: Request, res: Response) {
        const expense_id = parseInt(req.params.expenseId)
        const expense = await this.expenseService.getExpenseById(expense_id)
        res.json({ expense })
    }

    public async addExpense(req: Request, res: Response) {
        try {
            // Validate input
            let { expense } = req.body;

            if (!expense) {
                throw new Error('Expenses details are required')
            }

            // Validate user details
            const user = await this.getUserFromRequest(req)

            if (!user)
                throw new Error('User does not exist')

            // Validate currency
            if (!expense.currency)
                throw new Error('Expense currency is required')

            const currency = await this.getCurrency(expense.currency)

            if (!currency)
                throw new Error(`Invalid currency: ${expense.currency}`)

            expense.currencyId = currency.id

            // Ensure required fields are present in the expense object
            if (typeof expense.amount !== 'number')
                throw new Error('Expense amount is required and must be a number.');

            // Ensure the date is valid
            if (typeof expense.day !== 'number' || typeof expense.day !== 'number' || typeof expense.year !== 'number')
                throw new Error(`Invalid Date`)

            // Ensure the name is a string
            if (typeof expense.name !== 'string')
                throw new Error('Name of expense must be a string')

            // Ensure the category is valid
            const category = await this.categoryService.getCategoryByName(expense.category)
            if (category)
                expense.categoryId = category.id
            else
                throw new Error(`Invalid category: ${expense.category}`)

            // Update user_id in expense to match the user making the request
            expense.userId = user.id;
            await this.expenseService.addExpense(expense);
            res.status(200).json({
                message: 'Successfully added expense',
                expenses: this.expenseService.getAllExpenses(),
            });

        } catch (error) {
            console.error('Error trying to add expense:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    // editExpense(req: Request, res: Response) {
    //     try {
    //         const { new_expense_details } = req.body
    //         const expense_id = parseInt(req.params.expenseId)
    //         let expense = this.expenseService.getExpenseById(expense_id)

    //         const user = this.userService.getUserByUsername(req.body.user.username)

    //         if (!user) {
    //             throw new Error('User does not exist')
    //         }

    //         if (!expense) {
    //             throw new Error('Expense does not exist')
    //         }

    //         if (expense.user_id !== user.user_id) {
    //             throw new Error(`User id of expense does not match the user requesting`)
    //         }

    //         // Validate currency
    //         if (!new_expense_details.currency) {
    //             throw new Error('Expense currency is required')
    //         }

    //         const currency = this.getCurrency(new_expense_details.currency)

    //         if (!currency) {
    //             console.error(`Received ${currency} as currency`)
    //             throw new Error(`Invalid currency: ${new_expense_details.currency}`)
    //         }

    //         expense.currency = currency

    //         if (expense) {
    //             this.expenseService.editExpense(expense, new_expense_details)
    //             res.json({
    //                 message: 'Successfully edited expense',
    //                 expense: this.expenseService.getExpenseById(expense_id)
    //             })
    //             return
    //         } res.status(500).send('Whoops something went wrong!')

    //     } catch (error) {
    //         console.error('Error trying to edit expense:', error)
    //         res.status(500).send('Internal Server Error')
    //     }
    // }

    // deleteExpense(req: Request, res: Response) {
    //     try {
    //         const expense_id = parseInt(req.params.expenseId)
    //         const user_details = req.body.user
    //         const expense = this.expenseService.getExpenseById(expense_id)

    //         if (!expense) {
    //             throw new Error(`No expense with id ${expense_id}`)
    //         }

    //         const user = this.userService.getUserById(user_details.user_id)

    //         if (user?.user_id && user.user_id === expense?.user_id) {
    //             throw new Error(`User id of expense does not match the user requesting`)
    //         }

    //         this.expenseService.deleteExpense(expense)
    //         res.status(200).json({ message: 'Successfully deleted' });

    //     } catch (error) {
    //         console.error('Error trying to delete expense:', error)
    //         res.status(500).send('Internal Server Error')
    //     }
    // }

    async getExpenseByUser(req: Request, res: Response): Promise<void> {
        const user = await this.getUserFromParam(req)

        if (user)
            res.status(200).send(this.expenseService.getExpenseByUser(user))
        else
            res.status(401).send(`No user with the id ${req.params.userId}`)
    }

    // getUserExpenseByMonth(req: Request, res: Response): void {
    //     const user = this.getUserFromParam(req)
    //     const { month, year } = req.body

    //     if (user) {
    //         res.status(200).send(this.expenseService.getUserExpenseByMonth(user, month, year))
    //     } else {
    //         res.status(401).send(`No user with the id ${req.params.userId}`)
    //     }
    // }

    // getUserExpenseByYear(req: Request, res: Response): void {
    //     const user = this.getUserFromParam(req)
    //     const { year } = req.body

    //     if (user) {
    //         res.status(200).send(this.expenseService.getUserExpenseByYear(user, year))
    //     } else {
    //         res.status(401).send(`No user with the id ${req.params.userId}`)
    //     }
    // }

    // getUserExpenseByCategory(req: Request, res: Response): void {
    //     const user = this.getUserFromParam(req)
    //     const { category: category_name } = req.body

    //     const category = this.categoryService.getCategoryByName(category_name)

    //     if (user && category) {
    //         res.status(200).send(this.expenseService.getUserExpenseByCategory(user, category))
    //     } else {
    //         res.status(401).send(`No user with the id ${req.params.userId}`)
    //     }
    // }
}
