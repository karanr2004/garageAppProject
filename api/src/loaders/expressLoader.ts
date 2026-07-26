import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { useExpressServer } from 'routing-controllers';
import { env } from '../env';
import { authMiddleware } from '../api/middlewares/authMiddleware';

export const expressLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  if (!settings) {
    return;
  }

  const expressApp = express();

  expressApp.use(helmet({ contentSecurityPolicy: false }));
  expressApp.use(cors({ origin: env.cors.origin, credentials: true }));
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: true }));

  expressApp.use('/api', authMiddleware);

  useExpressServer(expressApp, {
    cors: false,
    classTransformer: true,
    validation: false, // disabled temporarily to avoid container Validator error in dev
    defaultErrorHandler: true,
    routePrefix: '/api',
    controllers: env.app.dirs.controllers,
    currentUserChecker: (action) => action.request.user,
  });

  if (!env.app.port) {
    throw new Error('APP_PORT is not defined');
  }

  const server = expressApp.listen(env.app.port, env.app.host);
  settings.setData('express_app', expressApp);
  settings.setData('express_server', server);
};
