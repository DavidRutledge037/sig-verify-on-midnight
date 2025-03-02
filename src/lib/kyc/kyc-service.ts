import { MidnightLaceWallet } from '../wallet/midnight-lace.ts';
import { DIDService } from '../did/did-service.ts';

export enum KYCLevel {
  NONE = 0,
  BASIC = 1,
  ADVANCED = 2
}

export class KYCService {
  private wallet: MidnightLaceWallet;
  private didService: DIDService;
  private static instance: KYCService;
  private kycLevels: Map<string, KYCLevel>;

  constructor(wallet: MidnightLaceWallet, didService: DIDService) {
    this.wallet = wallet;
    this.didService = didService;
    this.kycLevels = new Map();
  }

  static getInstance(wallet: MidnightLaceWallet, didService: DIDService): KYCService {
    if (!KYCService.instance) {
      KYCService.instance = new KYCService(wallet, didService);
    }
    return KYCService.instance;
  }

  async setKYCLevel(did: string, level: KYCLevel): Promise<void> {
    this.kycLevels.set(did, level);
  }

  async getKYCLevel(did: string): Promise<KYCLevel> {
    return this.kycLevels.get(did) || KYCLevel.NONE;
  }

  async hasKYCLevel(did: string): Promise<boolean> {
    return this.kycLevels.has(did);
  }

  async meetsKYCLevel(did: string, requiredLevel: KYCLevel): Promise<boolean> {
    const currentLevel = await this.getKYCLevel(did);
    return currentLevel >= requiredLevel;
  }

  async requestVerification(level: KYCLevel): Promise<boolean> {
    // Mock implementation for testing
    return true;
  }
}
