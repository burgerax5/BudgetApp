import express, { Router, Response, Request } from 'express';

import { ExpenseController } from '../controllers/expenseController';
import { authenticateToken } from '../middlewares/authenticationMiddleware';
import { expenseService, userService } from '../services/service_init';

const router: Router = express.Router();
const expenseController: ExpenseController = new ExpenseController(expenseService, userService)

router.get('/', authenticateToken, (req: Request, res: Response) => {
    expenseController.getExpenseByParams(req, res)
})

router.get('/:expenseId', authenticateToken, (req: Request, res: Response) => {
    expenseController.getExpenseById(req, res);
});

router.post('/add', authenticateToken, (req: Request, res: Response) => {
    expenseController.addExpense(req, res);
});

router.put('/edit/:expenseId', authenticateToken, (req: Request, res: Response) => {
    expenseController.editExpense(req, res)
})

router.delete('/delete/:expenseId', authenticateToken, (req: Request, res: Response) => {
    expenseController.deleteExpense(req, res)
})

export default router;