import express, { Router, Response, Request } from 'express';

import { ExpenseController } from '../controllers/expenseController';
import { authenticateToken } from '../middlewares/authenticationMiddleware';
import { expenseService, userService, currencyService } from '../services/service_init';

const router: Router = express.Router();
const expenseController: ExpenseController = new ExpenseController(expenseService, userService, currencyService)

router.get('/user/:userId', (req: Request, res: Response) => {
    expenseController.getExpenseByUser(req, res)
})

router.get('/:expenseId', (req: Request, res: Response) => {
    expenseController.getExpenseById(req, res);
});

router.post('/add', authenticateToken, (req: Request, res: Response) => {
    expenseController.addExpense(req, res);
});

router.put('/edit/:expenseId', authenticateToken, (req: Request, res: Response) => {
    expenseController.editExpense(req, res)
})

// router.delete('/delete/:expenseId', authenticateToken, (req: Request, res: Response) => {
//     expenseController.deleteExpense(req, res)
// })

// router.get('/month/:userId', authenticateToken, (req: Request, res: Response) => {
//     // expecting: { month: number, year: number }
//     expenseController.getUserExpenseByMonth(req, res)
// })

// router.get('/year/:userId', authenticateToken, (req: Request, res: Response) => {
//     // expecting: { year: number }
//     expenseController.getUserExpenseByYear(req, res)
// })

// router.get('/category/:userId', authenticateToken, (req: Request, res: Response) => {
//     // expecting: { category: string }
//     expenseController.getUserExpenseByCategory(req, res)
// })

export default router;