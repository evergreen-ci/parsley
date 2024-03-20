# This file downloads bucket data for task output.


RED='\033[0;31m'
NC='\033[0m' # No Color
YELLOW='\033[1;33m'
GREEN='\033[0;32m'

# Check to see if we have a _bucketdata directory
if [ ! -d "bin/_bucketdata" ]; then
    echo "${RED}No _bucketdata directory found!${NC}"
    echo "Creating one now..."
    mkdir bin/_bucketdata
    # Use aws cli to download the bucket data
    echo "Downloading bucket data..."
    # Try to download the bucket data
    aws s3 cp s3://parsley-test/_bucketdata.tar.gz bin/_bucketdata.tar.gz
    # Check to see if the download was successful
    if [ $? -ne 0 ]; then
        echo "${RED}Failed to download bucket data!${NC}"
        echo "Please make sure you have the aws cli installed and configured."
        echo "See https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html for more information."
        echo "Cleaning up _bucketdata directory..."
        rm -rf bin/_bucketdata
        exit 1
    fi
    # Uncompress the files in the _bucketdata directory
    echo "Uncompressing bucket data..."
    tar -xzf bin/_bucketdata.tar.gz -C bin/
    # Check to see if the uncompress was successful
    if [ $? -ne 0 ]; then
        echo "${RED}Failed to uncompress bucket data!${NC}"
        echo "Cleaning up _bucketdata directory..."
        rm -rf bin/_bucketdata
        exit 1
    fi
    echo "Finished uncompressing files."
    echo "Cleaning up _bucketdata directory..."
    rm bin/_bucketdata.tar.gz
    echo "Done!"
    echo "${GREEN}Bucket data downloaded successfully!${NC}"
    
else
    echo "Found bin/_bucketdata directory, skipping download..."
    echo "If you want to download the bucket data again, delete the _bucketdata directory and rerun this script."
fi

echo "Use the following command to start logkeeper:"
echo "${YELLOW}LK_CORS_ORIGINS=http:\/\/localhost:\\\d+ LK_EVERGREEN_ORIGIN=http://localhost:8080 LK_PARSLEY_ORIGIN=http://localhost:5173 go run main/logkeeper.go --localPath $PWD/bin/_bucketdata${NC}"

echo "Create symlink in your local evergreen directory:"
echo "ln -s $PWD/bin/_bucketdata _bucketdata"
