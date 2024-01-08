import express, { Router, Response, Request } from 'express';

import { BudgetController } from '../controllers/budgetController';
import { authenticateToken } from '../middlewares/authenticationMiddleware';
import { budgetService, userService } from '../services/service_init';

const router: Router = express.Router();
const budgetController = new BudgetController(budgetService, userService)

router.get('/user/:userId', authenticateToken, (req: Request, res: Response) => {
    budgetController.getBudgetByUser(req, res)
})

router.post('/add', authenticateToken, (req: Request, res: Response) => {
    budgetController.addBudget(req, res)
})

export default router