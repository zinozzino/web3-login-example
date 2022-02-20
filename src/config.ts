/* eslint-disable import/prefer-default-export */
export const IS_SERVER = typeof window === 'undefined';
export const IS_METAMASK_ENABLED =
  typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
