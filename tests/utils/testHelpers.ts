import { randomBytes } from 'crypto';

export const generateTestDID = () => {
  const random = randomBytes(16).toString('hex');
  return `did:example:${random}`;
};

export const generateTestWalletAddress = () => {
  return `0x${randomBytes(20).toString('hex')}`;
};

export const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 