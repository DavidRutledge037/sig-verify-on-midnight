export interface IService {
    initialize(): Promise<void>;
    isInitialized(): boolean;
} 