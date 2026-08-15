import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createApiRouter } from './api/router';
import * as db from './server/userStore';

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '50mb' }));

// Create the API router using the local database
const apiRouter = createApiRouter(db);
app.use('/api', apiRouter);

// ----------------------------------------------------
// VITE / STATIC SERVING
// ----------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server Java II Review Studio listening on port ${PORT}`);
  });
}

start();
