export interface User {
    id?: number;
    did: string;
    publicKey: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Document {
    id?: number;
    hash: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Signature {
    id?: number;
    documentId: number;
    signerId: number;
    signature: string;
    createdAt?: Date;
    updatedAt?: Date;
} 