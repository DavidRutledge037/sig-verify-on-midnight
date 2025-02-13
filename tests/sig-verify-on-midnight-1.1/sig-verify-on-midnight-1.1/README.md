# Sig Verify on Midnight v1.1

A privacy-first, decentralized digital document signing platform built on the Midnight Network.

## Project Structure

├── src/
│ ├── services/
│ │ ├── wallet.ts
│ │ ├── did.ts
│ │ └── document.ts
│ └── interfaces/
│ └── wallet.ts
├── tests/
│ ├── unit/
│ │ ├── did-verification.test.ts
│ │ ├── document-hashing.test.ts
│ │ └── signature-verification.test.ts
│ └── integration/
└── package.json
Setup
bash
npm install
Testing
bash
npm run test:mocha

## Features
- DID-Based Identity Verification
- Document Hashing & Storage
- ZK Proof Generation
- Signature Verification
- Privacy-Preserving Document Tracking
