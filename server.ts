import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './src/server/routes/api';
import { httpLogger } from './src/server/middleware/logger';
import { errorHandler } from './src/server/middleware/errorHandler';

async function startServer() {
  const app = express();
  app.set('trust proxy', true);
  const PORT = 3000;

  app.use(express.json());

  // Attach HTTP request logger
  app.use(httpLogger);

  // API routes mounted at /api/v1 and /api
  app.use('/api/v1', apiRouter);
  app.use('/api', apiRouter);

  // Centralized Error Handler Middleware for API routes
  app.use(errorHandler);

  // Vite middleware for development vs static serve for production
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
    console.log(`CheKoja Secured Backend & Frontend Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
