import { useContainer as classValidatorUseContainer } from 'class-validator';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { useContainer as routingUseContainer } from 'routing-controllers';
import { Container } from 'typedi';

export const iocLoader: MicroframeworkLoader = (_settings: MicroframeworkSettings | undefined) => {
  routingUseContainer(Container);
  classValidatorUseContainer(Container);
};
