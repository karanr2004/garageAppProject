import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';

export const eventDispatchLoader: MicroframeworkLoader = (settings: MicroframeworkSettings | undefined) => {
  // Event subscribers can be imported here when needed.
  // Keeping loader present to match SpurtCommerce bootstrap order.
};
