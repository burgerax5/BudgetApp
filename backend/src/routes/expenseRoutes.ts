import express, { Router, Response, Request } from 'express';

import { ExpenseController } from '../controllers/expenseController';
import { authenticateToken } from '../middlewares/authenticationMiddleware';
import { expenseService, userService } from '../services/service_init';

const router: Router = express.Router();
const expenseController: ExpenseController = new ExpenseController(expenseService, userService)

router.post('/add', authenticateToken, async (req: Request, res: Response) => {
    await expenseController.addExpense(req, res);
});

export default router;