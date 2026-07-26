import { Logger } from '../logger/Logger';
import { env } from '../../env';

export function banner(log: Logger): void {
  if (env.app.banner) {
    const hostLabel = env.app.host === '0.0.0.0' ? 'localhost' : env.app.host;
    log.info('================================================');
    log.info(`  ${env.app.name} is running`);
    log.info(`  Host: ${env.app.host}`);
    log.info(`  Port: ${env.app.port}`);
    log.info(`  Monitor: http://${hostLabel}:${env.app.port}${env.monitor.route}`);
    log.info('================================================');
  } else {
    log.info(`${env.app.name} started on port ${env.app.port}`);
  }
}
