import { beforeAll, afterAll, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { beforeEach, afterEach } from 'vitest';
import { jest } from '@jest/globals';

// Make vi available globally for tests
globalThis.vi = vi;

// Map jest functions to vitest
jest.fn = vi.fn;
jest.spyOn = vi.spyOn;
jest.mock = vi.mock;
jest.clearAllMocks = vi.clearAllMocks;

// Mock React components properly
vi.mock('../src/components/StepIndicator', () => ({
    StepIndicator: ({ currentStep }: { currentStep: number }) => 
        React.createElement('div', { 'data-testid': 'step-indicator' }, `Step ${currentStep}`)
}));

vi.mock('../src/components/DropZone', () => ({
    DropZone: ({ onDrop }: { onDrop: (files: File[]) => void }) => 
        React.createElement('div', { 
            'data-testid': 'dropzone',
            onDrop: (e: any) => {
                e.preventDefault();
                onDrop(Array.from(e.dataTransfer.files));
            }
        }, 'Drop files here')
}));

vi.mock('../src/components/DocumentPreview', () => ({
    DocumentPreview: ({ files }: { files: File[] }) => 
        React.createElement('div', { 'data-testid': 'document-preview' }, 
            `Previewing ${files.length} files`)
}));

vi.mock('../src/components/UploadProgress', () => ({
    UploadProgress: ({ files }: { files: File[] }) => 
        React.createElement('div', { 'data-testid': 'upload-progress' }, 
            `Uploading ${files.length} files`)
}));

vi.mock('../src/components/BasicInfo', () => ({
    BasicInfo: () => 
        React.createElement('div', { 'data-testid': 'basic-info' }, 'Basic Info Form')
}));

vi.mock('../src/components/KYCUpload', () => ({
    KYCUpload: () => 
        React.createElement('div', { 'data-testid': 'kyc-upload' }, 'KYC Upload Form')
}));

vi.mock('../src/components/DIDConfirmation', () => ({
    DIDConfirmation: () => 
        React.createElement('div', { 'data-testid': 'did-confirmation' }, 'DID Confirmation')
}));

// Mock crypto module using exact syntax from error message
vi.mock('crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('crypto')>()
  const mockHash = {
    content: '',
    update(data: any) {
      this.content = Buffer.from(data).toString();
      return this;
    },
    digest(encoding: string) {
      return Buffer.from(this.content).toString('hex').substring(0, 32);
    }
  };

  return {
    ...actual,
    createHash: () => mockHash,
    randomBytes: (size: number) => Buffer.from('a'.repeat(size)),
    default: {
      createHash: () => mockHash,
      randomBytes: (size: number) => Buffer.from('a'.repeat(size))
    }
  }
});

// Mock File API
global.File = class MockFile {
    name: string;
    type: string;
    content: string;

    constructor(content: string[], name: string, options: { type: string }) {
        this.content = content[0];
        this.name = name;
        this.type = options.type;
    }

    async arrayBuffer() {
        return new TextEncoder().encode(this.content).buffer;
    }
};

// Mock MongoDB collections with working implementations
const mockCollections: { [key: string]: any } = {};

const getMockCollection = (name: string) => {
    if (!mockCollections[name]) {
        const documents = new Map();
        
        mockCollections[name] = {
            insertOne: vi.fn(async (doc) => {
                const id = Math.random().toString(36).substring(7);
                const fullDoc = { _id: id, ...doc };
                documents.set(id, fullDoc);
                return { insertedId: id, value: fullDoc };
            }),
            findOne: vi.fn(async (query) => {
                if (query._id) {
                    return documents.get(query._id);
                }
                for (const doc of documents.values()) {
                    if (query['did.id'] && doc.did?.id === query['did.id']) return doc;
                    if (query.hash && doc.hash === query.hash) return doc;
                    // Add other query matches as needed
                }
                return null;
            }),
            find: vi.fn().mockReturnValue({
                toArray: async () => Array.from(documents.values())
            }),
            findOneAndUpdate: vi.fn(async (query, update) => {
                for (const [id, doc] of documents) {
                    if (query._id === id) {
                        const updatedDoc = {
                            ...doc,
                            ...update.$set,
                            updatedAt: new Date()
                        };
                        documents.set(id, updatedDoc);
                        return { value: updatedDoc };
                    }
                }
                return { value: null };
            })
        };
    }
    return mockCollections[name];
};

// Mock MongoDB client
vi.mock('mongodb', () => ({
    MongoClient: vi.fn().mockImplementation(() => ({
        connect: vi.fn().mockResolvedValue(null),
        db: vi.fn().mockReturnValue({
            collection: vi.fn().mockImplementation((name) => getMockCollection(name))
        }),
        close: vi.fn().mockResolvedValue(null)
    }))
}));

beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(mockCollections).forEach(key => {
        delete mockCollections[key];
    });
});

beforeAll(() => {
    // Setup runs before all tests
});

afterAll(() => {
    // Cleanup runs after all tests
}); 