import 'reflect-metadata';

import { bootstrapMicroframework } from 'microframework-w3tec';

import { banner } from './lib/banner/banner';
import { Logger } from './lib/logger/Logger';
import { eventDispatchLoader } from './loaders/eventDispatchLoader';
import { expressLoader } from './loaders/expressLoader';
import { homeLoader } from './loaders/homeLoader';
import { iocLoader } from './loaders/iocLoader';
import { monitorLoader } from './loaders/monitorLoader';
import { publicLoader } from './loaders/publicLoader';
import { typeormLoader } from './loaders/typeormLoader';
import { winstonLoader } from './loaders/winstonLoader';

const log = new Logger(__filename);

bootstrapMicroframework({
  loaders: [
    winstonLoader,
    iocLoader,
    eventDispatchLoader,
    typeormLoader,
    expressLoader,
    monitorLoader,
    homeLoader,
    publicLoader,
  ],
})
  .then(() => banner(log))
    .catch((error) => {
      // log the full error stack for easier debugging
      log.error('Application is crashed: ' + (error && error.stack ? error.stack : JSON.stringify(error)));
    });
