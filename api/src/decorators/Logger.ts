import { Container } from 'typedi';
import { Logger as WinstonLogger } from '../lib/logger/Logger';

export function Logger(scope: string): ParameterDecorator {
  return (object, propertyName, index): void => {
    const logger = new WinstonLogger(scope);
    const property = propertyName ? propertyName.toString() : '';
    Container.registerHandler({
      object: object as any,
      propertyName: property,
      index,
      value: () => logger,
    });
  };
}

export type LoggerInterface = WinstonLogger;
