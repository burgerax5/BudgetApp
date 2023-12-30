import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import { UserService } from '../services/userService';

const compareAsync = promisify(bcrypt.compare);

export class AuthController {
    public static home(req: Request, res: Response) {
        res.status(200).send(`Welcome, ${req.body.user.username}`)
    }

    public static async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).send('Missing fields. Please enter both username and password.');
                return;
            }

            const user = UserService.getUserByUsername(username);
            if (!user) {
                res.status(401).send('User not found');
                return;
            }

            const result = await compareAsync(password, user.password);

            if (result) {
                const secretKey = process.env.ACCESS_TOKEN_SECRET;

                if (!secretKey) {
                    res.status(500).json({ error: 'JWT secret key is not defined' });
                    return;
                }

                const accessToken = jwt.sign({ username }, secretKey);
                res.json({ accessToken });
            } else {
                res.status(401).send('Invalid password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    public static async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).send('Missing fields. Please enter both username and password.');
                return;
            }

            const userExists = UserService.getUserByUsername(username);
            if (userExists) {
                res.status(400).send(`The user ${username} already exists.`);
                return;
            }

            await UserService.registerUser(username, password);
            res.send(`Registered the user ${username}`);
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).send('Internal Server Error');
        }
    }
}
