import express, { Express, NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    const secretKey = process.env.ACCESS_TOKEN_SECRET;

    if (!secretKey)
        return res.status(500).json({ error: 'JWT secret key is not defined' });

    if (token) {
        jwt.verify(token, secretKey, (err, user) => {
            if (err) return res.status(401).send('Token is invalid or expired')
    
            // Attach the user information to the request object
            if (!user) return res.sendStatus(403)
    
            req.body.user = user;
            next();
        });
    } else {
        res.status(401).send('Access denied. Missing token.')
    }
}