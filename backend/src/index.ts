import express, { Express } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'

import authRoutes from './routes/authRoutes';
import expenseRoutes from './routes/expenseRoutes'
// import budgetRoutes from './routes/budgetRoutes'

dotenv.config();

const app: Express = express();
const PORT: number = 8080;

app.use(cookieParser())
app.use(express.json());
app.use((req, res, next) => {
    console.log('Request Body: ', req.body);
    next();
});

app.use('/auth', authRoutes);
app.use('/expense', expenseRoutes)
// app.use('/budget', budgetRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});