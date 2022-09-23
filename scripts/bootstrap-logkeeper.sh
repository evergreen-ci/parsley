# This file downloads a resmoke log for use with the local logkeeper db


RED='\033[0;31m'
NC='\033[0m' # No Color
YELLOW='\033[1;33m'
GREEN='\033[0;32m'

SPRUCE_DIR=pwd

# Check to see if we have a _bucketdata directory
if [ ! -d "_bucketdata" ]; then
    echo "${RED}No _bucketdata directory found!${NC}"
    echo "Creating one now..."
    mkdir _bucketdata
    # Use aws cli to download the bucket data
    echo "Downloading bucket data..."
    # Try to download the bucket data
    aws s3 sync --content-encoding gzip  s3://parsley-test/ _bucketdata/ 
    # Check to see if the download was successful
    if [ $? -ne 0 ]; then
        echo "${RED}Failed to download bucket data!${NC}"
        echo "Please make sure you have the aws cli installed and configured."
        echo "See https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html for more information."
        echo "Cleaning up _bucketdata directory..."
        rm -rf _bucketdata
        exit 1
    fi
    # Uncompress the files in the _bucketdata directory
    echo "Uncompressing bucket data..."
    uncompressedCount=0
    # Recursively List all the files in the _bucketdata directory
    for file in $(find _bucketdata -type f); do
        # Check to see if the file is compressed
        if file --mime-type -b "$file" | grep -q gzip; then
            # If it is, uncompress it
            echo "Uncompressing $file"
            mv "$file" "$file.gz"
            gunzip "$file.gz"
            uncompressedCount=$((uncompressedCount+1))
        fi
    done
    echo "Uncompressed $uncompressedCount files."
    # Check to see if the uncompression was successful
    if [ $? -ne 0 ]; then
        echo "${RED}Failed to uncompress bucket data!${NC}"
        echo "Cleaning up _bucketdata directory..."
        rm -rf _bucketdata
        exit 1
    fi
    echo "${GREEN}Bucket data downloaded successfully!${NC}"
    
else
    echo "Found _bucketdata directory, skipping download..."
    echo "If you want to download the bucket data again, delete the _bucketdata directory and run this script again."
fi


echo "Use the following command to start logkeeper:"
echo "${YELLOW}LK_CORS_ORIGINS=http:\/\/localhost:\\\d+ go run main/logkeeper.go --localPath $PWD/_bucketdata${NC}"