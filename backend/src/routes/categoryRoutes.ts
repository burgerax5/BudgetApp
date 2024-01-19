import express, { Router, Response, Request } from 'express';

import { ExpenseController } from '../controllers/expenseController';
import { authenticateToken } from '../middlewares/authenticationMiddleware';
import { categoryService } from '../services/service_init';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories()
    res.json({
        categories: categories
    })
})


export default router;