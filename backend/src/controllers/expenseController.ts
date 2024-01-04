import { Request, Response } from 'express';

import { User } from '../models/User';
import { Currency } from '../models/Currency';

import { ExpenseServices } from '../services/expenseService';
import { UserService } from '../services/userService';
import { CategoryServices } from '../services/categoryService';

import { currencies } from '../constants/currencies';

export class ExpenseController {
    private expenseService: ExpenseServices
    private userService: UserService
    private categoryService: CategoryServices

    constructor(expenseService: ExpenseServices, userService: UserService) {
        this.expenseService = expenseService
        this.userService = userService
        this.categoryService = new CategoryServices()
    }

    private getUserFromRequest(req: Request): User | undefined {
        const user = this.userService.getUserByUsername(req.body.user.username);
        if (!user) {
            throw new Error(`No user with the details ${JSON.stringify(req.body.user)}`);
        }
        return user;
    }
    
    private getCurrency(code: string): Currency | undefined {
        let currency: Currency | undefined

        if (currencies !== null) {
            currency = currencies.find(curr => curr.cc === code)
        } return currency
    }

    private getUserFromParam(req: Request): User | undefined {
        const userId = parseInt(req.params.userId)
        const user = this.userService.getUserById(userId)
        return user
    }

    public addExpense(req: Request, res: Response) {
        try {
            // Validate input
            let { expense } = req.body;

            if (!expense) {
                throw new Error('Expenses details are required')
            }

            // Validate user details
            const user = this.getUserFromRequest(req)

            if (!user) {
                throw new Error('User does not exist')
            }

            // Validate currency
            if (!expense.currency) {
                throw new Error('Expense currency is required')
            }

            const currency = this.getCurrency(expense.currency)

            if (!currency) {
                console.error(`Received ${currency} as currency`)
                throw new Error(`Invalid currency: ${expense.currency}`)
            }

            expense.currency = currency

            // Ensure required fields are present in the expense object
            if (!expense.amount || typeof expense.amount !== 'number') {
                throw new Error('Expense amount is required and must be a number.');
            }

            // Convert the string date into a Date object
            expense.date = new Date(expense.date)

            // Ensure the date is a Date object
            if (!expense.date || expense.date.toString() === 'Invalid Date') {
                throw new Error(`Invalid Date`)
            }

            if (expense.category) {
                const category = this.categoryService.getCategoryByName(expense.category)
                if (!category) {
                    throw new Error(`Invalid category: ${expense.category}`)
                }

                expense.category = category

                // Update user_id in expense to match the user making the request
                expense.user_id = user.user_id;
                this.expenseService.addExpense(expense);
                res.status(200).json({
                    message: 'Successfully added expense',
                    expenses: this.expenseService.getAllExpenses(),
                });
            } else {
                throw new Error('Expense category is required')
            }
        } catch (error) {
            console.error('Error trying to add expense:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    editExpense(req: Request, res: Response) {
        try {
            const { new_expense_details } = req.body
            const expense_id = parseInt(req.params.expenseId)
            let expense = this.expenseService.getExpenseById(expense_id)

            const user = this.userService.getUserByUsername(req.body.user.username)

            if (!user) {
                throw new Error('User does not exist')
            }

            if (!expense) {
                throw new Error('Expense does not exist')
            }

            if (expense.user_id !== user.user_id) {
                throw new Error(`User id of expense does not match the user requesting`)
            }

            // Validate currency
            if (!new_expense_details.currency) {
                throw new Error('Expense currency is required')
            }

            const currency = this.getCurrency(new_expense_details.currency)

            if (!currency) {
                console.error(`Received ${currency} as currency`)
                throw new Error(`Invalid currency: ${new_expense_details.currency}`)
            }

            expense.currency = currency

            if (expense) {
                this.expenseService.editExpense(expense, new_expense_details)
                res.json({
                    message: 'Successfully edited expense',
                    expense: this.expenseService.getExpenseById(expense_id)
                })
                return
            } res.status(500).send('Whoops something went wrong!')

        } catch (error) {
            console.error('Error trying to edit expense:', error)
            res.status(500).send('Internal Server Error')
        }
    }

    deleteExpense(req: Request, res: Response) {
        try {
            const expense_id = parseInt(req.params.expenseId)
            const user_details = req.body.user
            const expense = this.expenseService.getExpenseById(expense_id)

            if (!expense) {
                throw new Error(`No expense with id ${expense_id}`)
            }

            const user = this.userService.getUserById(user_details.user_id)
            
            if (user?.user_id && user.user_id === expense?.user_id) {
                throw new Error(`User id of expense does not match the user requesting`)
            }

            this.expenseService.deleteExpense(expense)
            res.status(200).json({ message: 'Successfully deleted' });

        } catch (error) {
            console.error('Error trying to delete expense:', error)
            res.status(500).send('Internal Server Error')
        }
    }

    getExpenseByUser(req: Request, res: Response): void {
        const user = this.getUserFromParam(req)
        
        if (user) {
            res.status(200).send(this.expenseService.getExpenseByUser(user))
        } else {
            res.status(401).send(`No user with the id ${req.params.userId}`)
        }
    }

    getUserExpenseByMonth(req: Request, res: Response): void {
        const user = this.getUserFromParam(req)
        const { month, year } = req.body

        if (user) {
            res.status(200).send(this.expenseService.getUserExpenseByMonth(user, month, year))
        } else {
            res.status(401).send(`No user with the id ${req.params.userId}`)
        }
    }

    getUserExpenseByYear(req: Request, res: Response): void {
        const user = this.getUserFromParam(req)
        const { year } = req.body

        if (user) {
            res.status(200).send(this.expenseService.getUserExpenseByYear(user, year))
        } else {
            res.status(401).send(`No user with the id ${req.params.userId}`)
        }
    }

    getUserExpenseByCategory(req: Request, res: Response): void {
        const user = this.getUserFromParam(req)
        const { category: category_name } = req.body

        const category = this.categoryService.getCategoryByName(category_name)

        if (user && category) {
            res.status(200).send(this.expenseService.getUserExpenseByCategory(user, category))
        } else {
            res.status(401).send(`No user with the id ${req.params.userId}`)
        }
    }
}
