# This script waits for evergreen to be up and running.

# Listen on port 9090 for evergreen
echo "Waiting for evergreen to be up and running..."
while ! nc -z localhost 9090; do
    sleep 1
done

echo "Evergreen is up and running!"