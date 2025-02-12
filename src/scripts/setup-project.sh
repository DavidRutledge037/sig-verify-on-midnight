#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Starting Project Setup ===${NC}"

# Step 1: Install Dependencies
echo -e "\n${GREEN}Installing Dependencies...${NC}"
./src/scripts/install-deps.sh

# Step 2: Check TypeScript
echo -e "\n${GREEN}Checking TypeScript...${NC}"
npx ts-node src/scripts/check-ts.ts

# Step 3: Build Project
echo -e "\n${GREEN}Building Project...${NC}"
npm run build

# Step 4: Run Wallet Check
echo -e "\n${GREEN}Checking Wallet Configuration...${NC}"
npm run check-wallet

echo -e "\n${GREEN}Setup Complete!${NC}" 