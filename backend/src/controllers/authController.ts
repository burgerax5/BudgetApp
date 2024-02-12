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

    public home(req: Request, res: Response) {
        res.cookie('email', req.body.user.email)
        res.cookie('user_id', req.body.user_id)

        res.status(200).json({
            email: req.body.user.email,
            user_id: req.body.user.user_id,
        })
    }

    private generateAccessToken(secretKey: string, user: { user_id: number; email: string }) {
        return jwt.sign({ user_id: user.user_id, email: user.email }, secretKey, { expiresIn: '10m' });
    }

    private addRefreshToken(refreshToken: string) {
        this.userService.refreshTokens.push(refreshToken)
    }

    private removeRefreshToken(refreshToken: string) {
        this.userService.refreshTokens = this.userService.refreshTokens.filter(t => t !== refreshToken)
    }

    private verifyRefreshToken(refreshToken: string) {
        return this.userService.refreshTokens.includes(refreshToken)
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).send('Missing fields. Please enter both email and password.');
                return;
            }

            const user = await this.userService.getUserByEmail(email);

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

                const user_token_details = { user_id: user.id, email: user.email }

                const accessToken = this.generateAccessToken(secretKey, user_token_details)
                const refreshToken = jwt.sign(user_token_details, refreshSecretKey)
                this.addRefreshToken(refreshToken)

                res.cookie("access-token", accessToken, {
                    maxAge: 2.592e+9, // 1 month
                    httpOnly: true,
                    secure: true
                })

                res.cookie("refresh-token", refreshToken, {
                    httpOnly: true,
                    secure: true
                })

                res.status(200).json({
                    email
                });
            } else {
                res.status(400).send('Invalid password');
            }
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    public async register(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                res.status(400).send('Missing fields. Please enter both email and password.');
                return;
            }

            const userExists = await this.userService.getUserByEmail(email);
            if (userExists) {
                res.status(400).send(`The ${email} is already taken.`);
                return;
            }

            const user = await this.userService.registerUser(email, password);
            if (user)
                res.send(`Registered the user ${email}`);
            else
                throw new Error('Failed to register')
        } catch (error) {
            console.error('Error during registration:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    public logout(req: Request, res: Response) {
        const token = req.cookies['refresh-token']

        if (!token)
            return res.status(401).send('Expected refresh token in header')

        if (!this.userService.refreshTokens.includes(token))
            return res.status(403).send('Invalid token')

        this.clearCookies(req, res)

        this.removeRefreshToken(token)
        res.status(200).send('Successful logout.')
    }

    public token(req: Request, res: Response) {
        try {
            const refreshToken = req.cookies['refresh-token']
            console.log(refreshToken)
            console.log(this.userService.refreshTokens)
            if (!refreshToken) return res.status(401).send('Missing refresh token')

            if (!this.verifyRefreshToken(refreshToken))
                return res.status(401).send('Invalid refresh token')

            const refreshSecret = process.env.REFRESH_TOKEN_SECRET
            const accessSecret = process.env.ACCESS_TOKEN_SECRET

            if (!refreshSecret)
                throw new Error('JWT refresh token secret is not defined')

            if (!accessSecret)
                throw new Error('JWT access token secret is not defined')

            jwt.verify(refreshToken, refreshSecret, (err: unknown, user: unknown) => {
                if (err) return res.status(401).send('Invalid refresh token')
                if (!user) return res.sendStatus(403)

                const accessToken = this.generateAccessToken(accessSecret, user)

                res.cookie('access-token', accessToken, {
                    maxAge: 2.592e+9,
                    httpOnly: true,
                    secure: true
                })

                res.status(200).send(accessToken)
            })
        } catch (error) {
            console.error('Error occurred while checking refresh token', error)
            res.status(500).send('Internal Server Error')
        }
    }

    public clearCookies(req: Request, res: Response) {
        res.cookie("access-token", "", {
            maxAge: 0,
            httpOnly: true,
            secure: true
        })

        res.cookie("refresh-token", "", {
            maxAge: 0,
            httpOnly: true,
            secure: true
        })
    }

    public async getUsers(req: Request, res: Response): Promise<void> {
        res.status(200).send(await this.userService.getAllUsers())
    }

    public async getUserByEmail(req: Request, res: Response): Promise<void> {
        const user = await this.userService.getUserByEmail(req.params.email)
        res.status(200).send({
            user_exists: user ? true : false
        })
    }
}
