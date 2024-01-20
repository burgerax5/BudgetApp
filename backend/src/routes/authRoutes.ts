import express, { Router, Response, Request } from 'express';

import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authenticationMiddleware';
import { userService } from '../services/service_init';

const router: Router = express.Router();
const authController: AuthController = new AuthController(userService)

router.get('/', authenticateToken, (req: Request, res: Response) => {
    authController.home(req, res)
});

router.get('/clear-cookies', (req: Request, res: Response) => {
    authController.clearCookies(req, res)
})

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

router.get('/users/:username', (req: Request, res: Response) => {
    authController.getUserByUsername(req, res)
})

export default router;