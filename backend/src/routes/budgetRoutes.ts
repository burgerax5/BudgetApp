import express, { Router, Response, Request } from 'express';

import { BudgetController } from '../controllers/budgetController';
import { authenticateToken } from '../middlewares/authenticationMiddleware';
import { budgetService, userService } from '../services/service_init';

const router: Router = express.Router();
const budgetController = new BudgetController(budgetService, userService)

router.get('/', authenticateToken, (req: Request, res: Response) => {
    budgetController.getBudgets(req, res)
})

router.post('/add', authenticateToken, (req: Request, res: Response) => {
    budgetController.addBudget(req, res)
})

router.put('/edit/:budgetId', authenticateToken, (req: Request, res: Response) => {
    budgetController.editBudget(req, res)
})

router.delete('/delete/:budgetId', authenticateToken, (req: Request, res: Response) => {
    budgetController.deleteBudget(req, res)
})

export default router