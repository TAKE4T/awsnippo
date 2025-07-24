#!/bin/bash

# AWS Amplify deployment script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

APP_NAME="nippo-app"
BRANCH="main"

echo -e "${YELLOW}Deploying to AWS Amplify...${NC}"

# Check if Amplify CLI is installed
if ! command -v amplify &> /dev/null; then
    echo -e "${RED}Amplify CLI is not installed. Installing...${NC}"
    npm install -g @aws-amplify/cli
fi

# Initialize Amplify project if not already initialized
if [ ! -f "amplify/.config/project-config.json" ]; then
    echo -e "${YELLOW}Initializing Amplify project...${NC}"
    amplify init --yes
fi

# Add hosting if not already added
if [ ! -d "amplify/backend/hosting" ]; then
    echo -e "${YELLOW}Adding hosting...${NC}"
    amplify add hosting
fi

# Deploy
echo -e "${YELLOW}Publishing to Amplify...${NC}"
amplify publish --yes

echo -e "${GREEN}Amplify deployment completed!${NC}"