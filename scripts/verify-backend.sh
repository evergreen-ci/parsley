# Script that checks to see if the backend is running
# It will check to see if ports 9090 and 8080 are open
# If they are not, it will error

RED='\033[0;31m'
NC='\033[0m' # No Color
YELLOW='\033[1;33m'
# Check to see if evergreen is running on port 9090
if ! nc -z localhost 9090; then
    # If it is not, restart the backend
    echo "${RED}Evergreen is not running, please start it!${NC}"
    echo "Use the following command to start it:"
    echo "${YELLOW}make local-evergreen${NC}"
    exit 1
fi

# Check to see if logkeeper is running on port 8080
if ! nc -z localhost 8080; then
    # If it is not, restart the backend
    echo "${RED}Logkeeper is not running, please start it!${NC}"
    echo "Use the following command to start it:"
    echo "${YELLOW}LK_CORS_ORIGINS=http:\/\/localhost:\\d+ go run main/logkeeper.go --localPath _bucketdata${NC}"
    exit 1
fi
