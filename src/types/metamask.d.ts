import { Provider } from 'web3-core';

declare global {
  interface Window {
    ethereum: Provider;
  }
}
