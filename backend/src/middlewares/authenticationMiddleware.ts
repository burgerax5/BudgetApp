import express, { Express, NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.sendStatus(401);
    }

    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    if (!secretKey) {
        return res.status(500).json({ error: 'JWT secret key is not defined' });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);

        // Attach the user information to the request object
        if (!user) return res.sendStatus(403)

        req.body.user = user;
        next();
    });
}