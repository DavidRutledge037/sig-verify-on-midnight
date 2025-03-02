export const config = {
  proofServer: {
    url: process.env.NEXT_PUBLIC_PROOF_SERVER_URL || 'http://localhost:6300',
    retryConfig: {
      maxRetries: 3,
      initialDelay: 1000,
      maxDelay: 10000,
      backoffFactor: 2
    }
  },
  // Add other config sections as needed
} as const;
