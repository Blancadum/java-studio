import express from 'express';
import { createApiRouter } from './router';
import * as db from '../lib/kv'; // Usar el store de Redis para producción

const app = express();
app.use(express.json({ limit: '50mb' }));

// Create the API router using the production Redis database
const apiRouter = createApiRouter(db);
app.use('/api', apiRouter);

// ── Export para Vercel ────────────────────────────────────────────────────────
export default app;
