#!/bin/sh

# This script runs the AWS CLI command to deploy the app to S3.

# Try this step and throw an error if it fails
echo "Deploying to S3"
aws s3 sync dist/ s3://"${BUCKET}"/ --acl public-read --follow-symlinks --delete --exclude .env-cmdrc.json 
echo "Deployed to S3"
