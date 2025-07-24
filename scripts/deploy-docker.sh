#!/bin/bash

# Docker deployment script for AWS ECS
set -e

# Configuration
AWS_REGION="ap-northeast-1"
ECR_REPOSITORY="nippo-app"
IMAGE_TAG="latest"
CLUSTER_NAME="nippo-cluster"
SERVICE_NAME="nippo-service"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Docker deployment to AWS ECS...${NC}"

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# ECR repository URI
ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY"

# Login to ECR
echo -e "${YELLOW}Logging in to Amazon ECR...${NC}"
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URI

# Create ECR repository if it doesn't exist
echo -e "${YELLOW}Checking if ECR repository exists...${NC}"
if ! aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION &> /dev/null; then
    echo -e "${YELLOW}Creating ECR repository: $ECR_REPOSITORY${NC}"
    aws ecr create-repository --repository-name $ECR_REPOSITORY --region $AWS_REGION
fi

# Build Docker image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t $ECR_REPOSITORY:$IMAGE_TAG .

# Tag image for ECR
docker tag $ECR_REPOSITORY:$IMAGE_TAG $ECR_URI:$IMAGE_TAG

# Push image to ECR
echo -e "${YELLOW}Pushing image to ECR...${NC}"
docker push $ECR_URI:$IMAGE_TAG

# Update ECS service (if exists)
if aws ecs describe-services --cluster $CLUSTER_NAME --services $SERVICE_NAME --region $AWS_REGION &> /dev/null; then
    echo -e "${YELLOW}Updating ECS service...${NC}"
    aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_NAME --force-new-deployment --region $AWS_REGION
    echo -e "${GREEN}ECS service updated successfully!${NC}"
else
    echo -e "${YELLOW}ECS service not found. Please create ECS cluster and service manually.${NC}"
    echo -e "${GREEN}Docker image pushed to: $ECR_URI:$IMAGE_TAG${NC}"
fi

echo -e "${GREEN}Docker deployment completed!${NC}"