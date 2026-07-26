import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Application } from 'express';
import { env } from '../env';

export const homeLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  if (settings) {
    const expressApp: Application = settings.getData('express_app');
    expressApp.get('/', (_req, res) => {
      res.json({
        name: env.app.name,
        status: 'ok',
        message: 'Two-wheeler garage management API',
      });
    });
    expressApp.get('/health', (_req, res) => {
      res.json({ status: 'healthy' });
    });
  }
};
