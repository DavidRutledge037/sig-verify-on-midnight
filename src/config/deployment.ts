import { NetworkId } from '@midnight-ntwrk/midnight-js-network-id';

export interface DeploymentConfig {
  didRegistry: string;
  signatureVerification: string;
  network: NetworkId;
  timestamp: string;
}

// Load deployment configuration
let deploymentConfig: DeploymentConfig;

try {
  deploymentConfig = require('../../deployments.json');
} catch (error) {
  console.warn('No deployment configuration found. Please run deploy-contracts.ts first.');
  deploymentConfig = {
    didRegistry: '',
    signatureVerification: '',
    network: NetworkId.TestNet,
    timestamp: ''
  };
}

export const DEPLOYMENT_CONFIG = deploymentConfig;
