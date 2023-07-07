#!/bin/bash

BASE_URL=$REACT_APP_PARSLEY_URL
# First download the currently deployed commit hash from s3
# If the curl fails, then use the previous tag from git
# If the curl succeeds, then use the githash from the curl
PREVIOUS_DEPLOYED_COMMIT=$(curl -s "$BASE_URL"/commit.txt)

if [ "$BASE_URL" == "" ]
then
    echo "BASE_URL not set"
    exit 1
fi

if [ "$PREVIOUS_DEPLOYED_COMMIT" == "" ]
then
    echo "PREVIOUS_DEPLOYED_COMMIT not found"
    exit 1
fi

# Save the current commit hash to a file
echo $PREVIOUS_DEPLOYED_COMMIT
echo "$PREVIOUS_DEPLOYED_COMMIT" > bin/previous_deploy.txt