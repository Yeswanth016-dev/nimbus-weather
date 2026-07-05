import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import weatherRoutes from './routes/weatherRoutes.js';
import errorHandler, { notFound } from './middleware/errorHandler.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || '*',
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Basic protection against abuse of the external weather API quota
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.get('/api/health', (req, res) => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    success: true,
    message: 'Nimbus Weather API is running',
    time: new Date().toISOString(),
    database: {
      status: states[mongoose.connection.readyState] || 'unknown',
      name: mongoose.connection.name,
    },
  });
});

app.use('/api/weather', weatherRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
