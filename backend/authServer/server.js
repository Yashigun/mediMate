import express from 'express';
import dotenv from 'dotenv';
import connectDB from './database/db.conect.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import authRouter from './routes/authRouter.js';

const app = express();

connectDB();

dotenv.config();

app.use(bodyParser.json());

app.use(cors());

app.use('/auth', authRouter);
//app.use('/products', ProductRouter);

app.listen (process.env.PORT || 5000, () => {
    console.log(`Server is runninng on port ${process.env.PORT}`);
});