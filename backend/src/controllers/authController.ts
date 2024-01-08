import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import { UserService } from '../services/userService';

const compareAsync = promisify(bcrypt.compare);

export class AuthController {
    private userService: UserService

    constructor(userService: UserService) {
        this.userService = userService
    }

    public static home(req: Request, res: Response) {
        res.status(200).send(`Welcome, ${req.body.user.username}`)
    }

    private generateAccessToken(secretKey: string, user: { user_id: number; username: string }) {
        return jwt.sign({ user_id: user.user_id, username: user.username }, secretKey, { expiresIn: '15m' });
    };

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).send('Missing fields. Please enter both username and password.');
                return;
            }

            const user = this.userService.getUserByUsername(username);
            if (!user) {
                res.status(401).send('User not found');
                return;
            }

            const result = await compareAsync(password, user.password);

            if (result) {
                const secretKey = process.env.ACCESS_TOKEN_SECRET;
                const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET

                if (!secretKey) 
                    throw new Error('JWT access token secret is not defined')

                if (!refreshSecretKey)
                    throw new Error('JWT refresh token secret is not defined')

                const accessToken = this.generateAccessToken(secretKey, user)
                const refreshToken = jwt.sign({ user_id: user.user_id, username: user.username }, secretKey)
                this.userService.refreshTokens.push(refreshToken)

                res.json({ accessToken, refreshToken });
            } else {
                res.status(401).send('Invalid password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).send('Missing fields. Please enter both username and password.');
                return;
            }

            const userExists = this.userService.getUserByUsername(username);
            if (userExists) {
                res.status(400).send(`The user ${username} already exists.`);
                return;
            }

            await this.userService.registerUser(username, password);
            res.send(`Registered the user ${username}`);
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    public logout(req: Request, res: Response) {
        const token = req.header('Authorization')?.split(' ')[1];

        if (!token)
            return res.status(400).send('Expected refresh token in header')

        console.log(token)
        console.log(this.userService.refreshTokens)

        if (!this.userService.refreshTokens.includes(token))
            return res.status(401).send('Invalid token')

        this.userService.refreshTokens = this.userService.refreshTokens.filter(t => t !== token)
        res.status(200).send('Successful logout.')
    }

    public token(req: Request, res: Response) {
        try {
            const refreshToken = req.body.refreshToken
            if (refreshToken == null) return res.sendStatus(401)
            if (this.userService.refreshTokens.includes(refreshToken))
                return res.sendStatus(403)

            const refreshSecret = process.env.REFRESH_TOKEN_SECRET
            const accessSecret = process.env.ACCESS_TOKEN_SECRET

            if (!refreshSecret)
                throw new Error('JWT refresh token secret is not defined')

            if (!accessSecret)
                throw new Error('JWT access token secret is not defined')

            jwt.verify(refreshToken, refreshSecret, (err, user) => {
                if (err) return res.status(403).send('bruh')
                if (!user) return res.sendStatus(403)

                const accessToken = this.generateAccessToken(accessSecret, user)
                res.status(200).send(accessToken)
            })
        } catch (error) {
            console.error('Error occurred while checking refresh token', error)
            res.status(500).send('Internal Server Error')
        }
    }

    public getUsers(req: Request, res: Response): void {
        res.status(200).send(this.userService.getAllUsers())
    }
}
