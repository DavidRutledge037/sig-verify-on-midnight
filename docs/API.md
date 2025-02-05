# Document Signing and Verification API Documentation

## Overview
This document describes the API endpoints for the Document Signing and Signature Verification system.

## Authentication
All API requests require authentication using JWT tokens.

## Endpoints

### Document Signing
- `POST /api/documents/sign` - Sign a document
- `POST /api/documents/sign-batch` - Sign multiple documents
- `GET /api/documents/signed/{documentId}` - Get signed document

### Signature Verification
- `POST /api/verify/signature` - Verify a document's signature
- `GET /api/verify/status/{verificationId}` - Check verification status
- `POST /api/verify/batch` - Verify multiple signatures

### DID Management
- `POST /api/did/create` - Create new signing identity
- `GET /api/did/resolve/{did}` - Resolve signer's DID
- `PUT /api/did/update` - Update signing identity

### Enterprise Workflows
- `POST /api/workflow/signing/start` - Start signing workflow
- `GET /api/workflow/verification/status/{workflowId}` - Check workflow status
- `PUT /api/workflow/signing/update/{workflowId}` - Update workflow

## Error Handling
Detailed error codes and handling procedures for signing and verification processes.
