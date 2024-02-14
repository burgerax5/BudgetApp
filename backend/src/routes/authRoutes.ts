import express, { Router, Response, Request } from 'express';

import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authenticationMiddleware';
import { userService } from '../services/service_init';

const router: Router = express.Router();
const authController: AuthController = new AuthController(userService)

router.get('/', authenticateToken, async (req: Request, res: Response) => {
    await authController.home(req, res)
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

// When adding 2FA to a user
router.get('/get-2fa-secret', authenticateToken, (req: Request, res: Response) => {
    authController.createOTPCode(req, res)
})

// Check if credentials are correct
router.post('/verify-credentials', (req: Request, res: Response) => {
    authController.verifyCredentials(req, res)
})

// Check if the OTP entered for 2FA is correct
router.post('/verify-otp', authenticateToken, (req: Request, res: Response) => {
    authController.verifyOTP(req, res)
})

router.post('/verify-otp-guest', (req: Request, res: Response) => {
    authController.verifyOTP(req, res)
})

router.post('/resetPassword', async (req: Request, res: Response) => {
    await authController.resetPassword(req, res)
})

export default router;