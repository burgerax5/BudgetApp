import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import speakeasy from "speakeasy"
import qrcode from "qrcode"

import { UserService } from '../services/userService';
import { User } from '@prisma/client';

const compareAsync = promisify(bcrypt.compare);

export class AuthController {
    private userService: UserService

    constructor(userService: UserService) {
        this.userService = userService
    }

    public home(req: Request, res: Response) {
        res.cookie('username', req.body.user.username)
        res.cookie('user_id', req.body.user_id)

        res.status(200).json({
            username: req.body.user.username,
            user_id: req.body.user.user_id,
        })
    }

    private generateAccessToken(secretKey: string, user: { user_id: number; username: string }) {
        return jwt.sign({ user_id: user.user_id, username: user.username }, secretKey, { expiresIn: '10m' });
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

    // Used when the user wants to enable 2FA
    public async createOTPCode(req: Request, res: Response) {
        const { user } = req.body

        if (user.secret)
            res.status(403).send('User already has 2FA set up.')

        const $secret = this.generate2FASecret(user.username)

        if ($secret.otpauth_url) {
            const qrcode = await this.generateQRCode($secret.otpauth_url)

            res.json({
                secret: $secret,
                qrcode: qrcode
            })
        } else {
            res.status(400).send('An error occurred while creating QR code')
        }
    }

    public async verifyOTP(req: Request, res: Response) {
        const { token, secret, username } = req.body

        if (!username)
            res.status(400).send('Could not find a user with the provided username.')

        let existing_secret = await this.userService.getSecret(username)
        const valid = this.isValidOTP(existing_secret ? existing_secret : secret, token)

        if (valid && !existing_secret)
            await this.userService.addSecret(username, secret)

        res.json({ valid })
    }

    generate2FASecret(username: string) {
        return speakeasy.generateSecret({
            name: `BudgetApp: ${username}`
        })
    }

    async generateQRCode(otpauthUrl: string) {
        return new Promise<string>((resolve, reject) => {
            qrcode.toDataURL(otpauthUrl, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    }

    private isValidOTP(secret: string, token: string) {
        return speakeasy.totp.verify({
            secret: secret,
            encoding: 'ascii',
            token: token
        })
    }

    private authenticateUser(res: Response, user: User) {

    }

    public async verifyCredentials(req: Request, res: Response) {
        try {
            const { username, password } = req.body;

            if (!username || !password) {
                res.status(400).send('Missing fields. Please enter both username and password.');
                return;
            }

            const user = await this.userService.getUserByUsername(username);

            if (!user) {
                res.status(401).send('User not found');
                return;
            }

            const result = await compareAsync(password, user.password);
            const results = {
                success: result,
                requires2FA: user.secret ? true : false,
                username: user.username
            }

            res.json(results)
            return results
        } catch (error) {
            console.error('Error during login:', error);
            res.status(500).send('Internal Server Error');
        }
    }

    public async login(req: Request, res: Response): Promise<void> {
        try {
            const { username } = req.body
            const user = await this.userService.getUserByUsername(username)

            if (user) {
                const secretKey = process.env.ACCESS_TOKEN_SECRET;
                const refreshSecretKey = process.env.REFRESH_TOKEN_SECRET

                if (!secretKey)
                    throw new Error('JWT access token secret is not defined')

                if (!refreshSecretKey)
                    throw new Error('JWT refresh token secret is not defined')

                const user_token_details = { user_id: user.id, username: user.username }

                const accessToken = this.generateAccessToken(secretKey, user_token_details)
                const refreshToken = jwt.sign(user_token_details, refreshSecretKey)
                this.addRefreshToken(refreshToken)

                console.log(`Access Token: ${accessToken}`)
                console.log(`Refresh Token: ${refreshToken}`)

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
                    username: user.username
                });
            }
            // this.authenticateUser(res, user)

            else
                res.status(400).send('User does not exist.')

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

            const userExists = await this.userService.getUserByUsername(username);
            if (userExists) {
                res.status(400).send(`The user ${username} already exists.`);
                return;
            }

            const user = await this.userService.registerUser(username, password);
            if (user)
                res.send(`Registered the user ${username}`);
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

    public async getUserByUsername(req: Request, res: Response): Promise<void> {
        const user = await this.userService.getUserByUsername(req.params.username)
        res.status(200).send({
            user_exists: user ? true : false
        })
    }
}
