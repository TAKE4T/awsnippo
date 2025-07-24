#!/bin/bash

# AWS S3 + CloudFront deployment script for Nippo App
set -e

# Configuration
BUCKET_NAME="nippo-app-static-site"
CLOUDFRONT_DISTRIBUTION_ID=""
AWS_REGION="ap-northeast-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment process...${NC}"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}AWS credentials not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

# Build the application
echo -e "${YELLOW}Building the application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed!${NC}"
    exit 1
fi

# Create S3 bucket if it doesn't exist
echo -e "${YELLOW}Checking if S3 bucket exists...${NC}"
if ! aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    echo -e "${GREEN}Bucket $BUCKET_NAME already exists.${NC}"
else
    echo -e "${YELLOW}Creating S3 bucket: $BUCKET_NAME${NC}"
    aws s3 mb "s3://$BUCKET_NAME" --region $AWS_REGION
    
    # Configure bucket for static website hosting
    aws s3 website "s3://$BUCKET_NAME" --index-document index.html --error-document index.html
    
    # Set bucket policy for public read access
    cat > /tmp/bucket-policy.json << EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
        }
    ]
}
EOF
    
    aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file:///tmp/bucket-policy.json
    rm /tmp/bucket-policy.json
fi

# Sync files to S3
echo -e "${YELLOW}Uploading files to S3...${NC}"
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete --cache-control "max-age=31536000" --exclude "*.html"
aws s3 sync dist/ "s3://$BUCKET_NAME" --delete --cache-control "max-age=0, no-cache, no-store, must-revalidate" --include "*.html"

# Invalidate CloudFront cache if distribution ID is provided
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}Invalidating CloudFront cache...${NC}"
    aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
fi

# Get website URL
WEBSITE_URL=$(aws s3api get-bucket-website --bucket $BUCKET_NAME --query 'WebsiteConfiguration.IndexDocument.Suffix' --output text 2>/dev/null || echo "")
if [ ! -z "$WEBSITE_URL" ]; then
    echo -e "${GREEN}Deployment completed successfully!${NC}"
    echo -e "${GREEN}Website URL: http://$BUCKET_NAME.s3-website-$AWS_REGION.amazonaws.com${NC}"
else
    echo -e "${GREEN}Files uploaded successfully to S3 bucket: $BUCKET_NAME${NC}"
fi

echo -e "${GREEN}Deployment process finished!${NC}"