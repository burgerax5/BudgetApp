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

            console.log(`User: ${req.body.user.username}`)
            const user = this.userService.getUserByUsername(req.body.user.username)

            if (!user) {
                throw new Error(`No user with the username ${JSON.stringify(req.body.user)}`);
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
}
