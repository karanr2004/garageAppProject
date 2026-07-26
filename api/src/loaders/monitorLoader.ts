import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { Application } from 'express';
import { env } from '../env';

// express-status-monitor has no official types
// eslint-disable-next-line @typescript-eslint/no-var-requires
const statusMonitor = require('express-status-monitor');

export const monitorLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  if (settings) {
    const expressApp: Application = settings.getData('express_app');
    expressApp.use(
      statusMonitor({
        path: env.monitor.route,
        title: `${env.app.name} Status`,
      })
    );
  }
};
