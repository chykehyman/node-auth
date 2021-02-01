import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import 'dotenv/config';
import 'colors';

import authRoutes from './routes/auth';

import connectDB from './config/db.config';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
const { PORT = 8000, NODE_ENV = 'development', MONGODB_URI } = process.env;
const corsHandler = cors();

/**************** Middleware Usage ******************/
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  morgan(
    // eslint-disable-next-line max-len
    '":method :url HTTP/:http-version" :status :res[content-length] :remote-addr - :remote-user [:date[clf]]'
      .green.italic.bold,
    {
      skip: (req, res) => NODE_ENV === 'production' && res.statusCode < 400,
    }
  )
);
app.use(corsHandler);
app.options('*', corsHandler);

connectDB(MONGODB_URI);

/************ Routes Usage **********/
app.use('/api/v1/auth', authRoutes);

app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(
    `Server running in ${NODE_ENV} mode at http://localhost:${PORT}`.yellow.bold
  )
);

process.on('unhandledRejection', (error) => {
  console.log(`${error.name}: ${error.message}`.bgRed.black);
  server.close(() => process.exit(1));
});
