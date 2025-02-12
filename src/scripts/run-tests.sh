#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Starting Test Suite ===${NC}"

# Build project
echo -e "\n${BLUE}Building project...${NC}"
npm run build

# Run E2E tests
echo -e "\n${BLUE}Running E2E tests...${NC}"
npm run test:e2e

# Check test results
if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}All tests passed successfully!${NC}"
else
    echo -e "\n${RED}Some tests failed. Check the output above for details.${NC}"
    exit 1
fi 