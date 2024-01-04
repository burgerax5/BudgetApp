import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import { ExpenseServices } from '../services/expenseService';
import { UserService } from '../services/userService';
import { CategoryServices } from '../services/categoryService';

export class ExpenseController {
    private expenseService: ExpenseServices
    private userService: UserService
    private categoryService: CategoryServices

    constructor(expenseService: ExpenseServices, userService: UserService) {
        this.expenseService = expenseService
        this.userService = userService
        this.categoryService = new CategoryServices()
    }

    public addExpense(req: Request, res: Response) {
        try {
            let { expense } = req.body;

            const user = this.userService.getUserByUsername(req.body.user.username)

            if (!user) {
                throw new Error(`No user with the details ${JSON.stringify(req.body.user)}`);
            } 

            expense = {...expense, user_id: user.user_id}

            if (!expense.category && !this.categoryService.getCategoryByName(expense.category.name)) {
                throw new Error(`Invalid category: ${expense.category}`)
            }

            this.expenseService.addExpense(expense)
            res.status(200).json({
                message: "Successfully added expense",
                expenses: this.expenseService.getAllExpenses()
            })
        } catch (error) {
            console.error('Error trying to add expense:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    editExpense(req: Request, res: Response) {
        try {
            const { expense: old_expense, new_expense_details } = req.body
            const expense_id = parseInt(req.params.expenseId)

            const user = this.userService.getUserByUsername(req.body.user.username)
            
            if (!user) {
                throw new Error(`No user with the details ${JSON.stringify(req.body.user)}`);
            }

            if (old_expense.user_id !== user.user_id) {
                throw new Error(`Owner of expense has id ${old_expense.user_id}, not ${user.user_id}`)
            }

            if (!this.expenseService.getExpenseById(expense_id)) {
                throw new Error(`No expense with the id ${expense_id}`)
            }

            let expense = this.expenseService.getExpenseById(expense_id)

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

    getExpenseByUser(req: Request, res: Response) {
        const userId = parseInt(req.params.userId)
        const user = this.userService.getUserById(userId)
        
        if (user) {
            res.send(this.expenseService.getExpenseByUser(user))
        } else {
            res.status(401).send(`No user with the id ${userId}`)
        }
    }
}
