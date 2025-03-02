import axios, { AxiosError, AxiosInstance } from 'axios';
import { config } from '../config.ts';
import {
  CircuitInfo,
  ProofRequest,
  ProofResponse,
  VerifyRequest,
  VerifyResponse,
  RetryConfig,
  ContractCallPrototype,
  ContractCall,
  Effects,
  Op,
  AlignedValue,
  Transcript,
  ProofServerError as ProofServerErrorType
} from './types.ts';
import { httpClientProofProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';

// Custom BigInt serializer for JSON
const bigIntSerializer = {
  stringify: (obj: any): string => {
    return JSON.stringify(obj, (_key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    });
  },
  parse: (text: string): any => {
    return JSON.parse(text, (_key, value) => {
      if (typeof value === 'string' && /^-?\d+n$/.test(value)) {
        return BigInt(value.slice(0, -1));
      }
      return value;
    });
  }
};

class ProofServerError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ProofServerError';
  }
}

export class ProofServerClient {
  private static instance: ProofServerClient;
  private client: AxiosInstance;
  private proofProvider: typeof httpClientProofProvider;
  private retryConfig: RetryConfig;

  private constructor() {
    this.client = axios.create({
      baseURL: config.proofServer.url,
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [(data) => {
        return bigIntSerializer.stringify(data);
      }],
      transformResponse: [(data) => {
        return typeof data === 'string' ? bigIntSerializer.parse(data) : data;
      }]
    });

    this.proofProvider = httpClientProofProvider;
    this.retryConfig = config.proofServer.retryConfig;

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      this.handleError.bind(this)
    );
  }

  public static getInstance(): ProofServerClient {
    if (!ProofServerClient.instance) {
      ProofServerClient.instance = new ProofServerClient();
    }
    return ProofServerClient.instance;
  }

  private async handleError(error: AxiosError<ProofServerErrorType>): Promise<never> {
    console.error('Proof server error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      request: error.config?.data
    });
    const serverError = new ProofServerError(
      error.response?.status || 500,
      error.response?.data?.message || error.message || 'Unknown error'
    );
    throw serverError;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/api/v1/health');
      return response.status === 200;
    } catch (error) {
      throw this.handleError(error as AxiosError<ProofServerErrorType>);
    }
  }

  public async getCircuitInfo(circuitId: string): Promise<CircuitInfo> {
    try {
      const response = await this.client.get(`/api/v1/circuits/${circuitId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ProofServerErrorType>);
    }
  }

  public async generateProof(transcript: Transcript<AlignedValue>, circuitId: string = 'signature_circuit'): Promise<ProofResponse> {
    try {
      console.log('Sending proof request:', { transcript, circuitId });
      const response = await this.client.post('/prove', {
        transcript,
        circuitId
      });
      console.log('Proof response:', response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ProofServerErrorType>);
    }
  }

  public async verifyProof(request: VerifyRequest, circuitId: string = 'signature_circuit'): Promise<VerifyResponse> {
    try {
      console.log('Sending verify request:', { request, circuitId });
      const response = await this.client.post('/verify', {
        request,
        circuitId
      });
      console.log('Verify response:', response.data);
      return response.data;
    } catch (error) {
      throw this.handleError(error as AxiosError<ProofServerErrorType>);
    }
  }
}
