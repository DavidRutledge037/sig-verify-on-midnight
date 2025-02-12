# Midnight Network Document Signing

A TypeScript implementation for secure document signing and verification on the Midnight Network.

## Overview
This implementation provides a secure way to:
- Store and verify document signatures
- Manage user identities using DIDs
- Create and validate digital signatures
- Maintain an immutable record of all signed documents

## Architecture
The system uses:
- PostgreSQL for secure data storage
- TypeScript for type-safe implementation
- Repository pattern for data access
- Comprehensive test coverage

## Security
- All documents are hashed before storage
- Signatures are cryptographically secure
- User identities are verified through DIDs

## Features
- Secure document storage and verification
- User management with DIDs
- Digital signature creation and validation
- PostgreSQL database integration

## Database Schema
- Users: Stores user DIDs and public keys
- Documents: Stores document hashes and content
- Signatures: Links users, documents, and their signatures

## Testing
Complete test suite for:
- Database operations
- User management
- Document handling
- Signature verification

## Setup
1. Create PostgreSQL database named 'midnight'
2. Run schema initialization
3. Install dependencies: `npm install`
4. Run tests: `npm test` 