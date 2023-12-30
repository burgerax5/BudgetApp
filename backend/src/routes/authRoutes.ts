import express, { Router } from 'express';

import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authenticationMiddleware';

const router: Router = express.Router();

router.get('/', authenticateToken, AuthController.home);
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

export default router;