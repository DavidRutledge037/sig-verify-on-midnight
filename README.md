# Sig Verify on Midnight
Version: 1.1

A privacy-first, decentralized digital document signing platform built on the Midnight Network. Ensures document authenticity, privacy, and automation through Decentralized Identity (DID), Zero-Knowledge Proofs (ZKP), and Smart Contracts.

## Core Features

### 1. Verifiable Document Signing
- Cryptographic signature guarantees
- Document authenticity verification
- Secure timestamp integration

### 2. DID-Based Identity Verification
- Decentralized Identity (DID) management
- User authentication system
- Identity verification protocols

### 3. Privacy-Preserving Zero-Knowledge Proofs
- ZKP-based user information protection
- Selective disclosure capabilities
- Privacy-first architecture

### 4. Smart Contract Workflow Automation
- Automated payment triggers
- Notification systems
- Approval chains
- Status tracking

### 5. Enterprise Interoperability
- Legal document handling
- Financial transaction support
- Cross-system compatibility

## Project Structure
```
src/
  contracts/           # Midnight Compact smart contracts
    did/              # DID implementation
    document/         # Document signing & verification
    workflow/         # Automated workflow management
  ui/                # Frontend application
  mock/              # Mock data for testing
tests/
  unit/              # Unit tests
  integration/       # Integration tests
docs/                # Documentation
```

## Development Setup

### Prerequisites
- Node.js >= 18
- Midnight Network Development Kit
- Powers of Tau file (15 powers) for circuit setup

### Installation
1. Install dependencies:
```bash
npm install
```

2. Compile the Compact circuits:
```bash
# First, download the Powers of Tau file
curl -o public/circuits/pot15_final.ptau https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau

# Compile the circuits
npm run compile:circuits

# Generate proving and verification keys
npm run setup:circuits
```

3. Start the development server:
```bash
npm run dev
```

### Circuit Development
The project uses Compact language (v0.14.0) for implementing zero-knowledge circuits:

1. Circuit Location:
   - All Compact circuits are in `src/contracts/*.compact`
   - Circuit artifacts are generated in `public/circuits/`

2. Circuit Components:
   - `signature_circuit.compact`: Main signature verification circuit
   - `did_registry.compact`: DID management circuit
   - `kyc_verification.compact`: KYC verification circuit

3. Testing:
```bash
# Run all tests
npm test

# Run contract-specific tests
npm run test:contracts
```

## Project Status

### Component Status

1. DID Registry (In Progress)
- Basic DID creation and management implemented
- Currently addressing alignment and state management issues
- Test suite needs fixes for proper state handling
- Detailed issues tracked in project documentation

2. KYC Verification (Next Focus)
- Circuit implementation pending testing
- Integration with DID system planned
- Privacy-preserving verification to be validated

3. Document Signing (Planned)
- Core signature verification planned
- Integration with DID and KYC systems pending
- Workflow automation to be implemented

### Known Issues

1. DID Registry Challenges:
- State alignment issues in simulator
- Contract return value handling
- Type safety improvements needed
- Full details in project documentation

2. Development Requirements:
- Strict runtime version requirements (@midnight-ntwrk/compact-runtime v0.7.0)
- Node.js experimental VM modules needed
- Proper field value handling for cryptographic operations

### Next Steps
1. Complete KYC circuit testing
2. Resolve DID registry implementation issues
3. Implement document signing functionality
4. Integrate all components
5. Comprehensive testing
6. Documentation updates

## Technical Stack
- Midnight Network
- Compact v0.14.0
- Lace Wallet Integration
- Zero-Knowledge Proofs
- TypeScript/React UI

## Testing
[Testing framework details to be added]

## Security
[Security measures and considerations to be added]

## Documentation
[Additional documentation to be added]
