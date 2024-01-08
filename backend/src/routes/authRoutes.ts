import express, { Router, Response, Request } from 'express';

import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authenticationMiddleware';
import { userService } from '../services/service_init';

const router: Router = express.Router();
const authController: AuthController = new AuthController(userService)

router.get('/', authenticateToken, AuthController.home);

router.post('/login', async (req: Request, res: Response) => {
    await authController.login(req, res);
});
  
router.post('/register', async (req: Request, res: Response) => {
    await authController.register(req, res);
});

router.post('/logout', (req: Request, res: Response) => {
    authController.logout(req, res);
})

router.post('/refresh-token', (req: Request, res: Response) => {
    authController.token(req, res);
})

router.get('/users', (req: Request, res: Response) => {
    authController.getUsers(req, res)
})

export default router;