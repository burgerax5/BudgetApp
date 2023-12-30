import express, { Express } from 'express';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Express = express();
const PORT: number = 8080;

app.use(express.json());
app.use((req, res, next) => {
    console.log('Request Body: ', req.body);
    next();
});

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});