import express, { Router, Response, Request } from 'express';

import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authenticationMiddleware';
import { UserService } from '../services/userService';

const router: Router = express.Router();
const userService: UserService = new UserService()
const authController: AuthController = new AuthController(userService)

router.get('/', authenticateToken, AuthController.home);

router.post('/login', async (req: Request, res: Response) => {
    await authController.login(req, res);
});
  
router.post('/register', async (req: Request, res: Response) => {
    await authController.register(req, res);
});

router.get('/users', (req: Request, res: Response) => {
    authController.getUsers(req, res)
})

export default router;