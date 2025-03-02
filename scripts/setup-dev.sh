#!/bin/bash

# Create necessary directories
mkdir -p ./bin
mkdir -p ./config
mkdir -p ./node-ipc

# Copy Compact compiler
echo "Setting up Compact compiler..."
cp ~/compactc-macos-3/compactc ./bin/
chmod +x ./bin/compactc

# Copy wallet example files
echo "Setting up wallet example files..."
cp -r ~/midnight-lace-1-2/* ./config/wallet-example/

# Copy Midnight examples
echo "Setting up Midnight examples..."
cp -r ~/midnight-examples-0.2.0/* ./config/examples/

# Create environment file
cat > .env << EOL
# Midnight Network Configuration
MIDNIGHT_NODE_SOCKET=/Users/davidrutledge/sig-verify-on-midnight/node-ipc/node.socket
MIDNIGHT_NETWORK=testnet
PROOF_SERVER_URL=http://localhost:8080

# Wallet Configuration
WALLET_PATH=/Users/davidrutledge/sig-verify-on-midnight/config/wallet-example

# Development Configuration
COMPACT_COMPILER_PATH=/Users/davidrutledge/sig-verify-on-midnight/bin/compactc
EOL

echo "Development environment setup complete!"
