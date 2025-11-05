#!/bin/bash

set -e

export PGPASSWORD=$POSTGRES_PASSWORD

EXISTING_SUB=$(psql -h localhost -U $POSTGRES_USER -d $POSTGRES_DB -t -A -c "SELECT 1 FROM pg_subscription WHERE subname = '$SUB_NAME' LIMIT 1;" 2>/dev/null || echo "0")

if [ "$EXISTING_SUB" = "1" ]; then
    echo "Subscription $SUB_NAME already exists"
    exit 0
fi

echo "Subscription $SUB_NAME does not exist, creating..."

EXISTING_PUB=$(psql -h $REPLICA_HOST -U $POSTGRES_USER -d $POSTGRES_DB -p $REPLICA_PORT -t -A -c "SELECT 1 FROM pg_publication WHERE pubname = '$PUB_NAME' LIMIT 1;" 2>/dev/null || echo "0")

if [ "$EXISTING_PUB" != "1" ]; then
    echo "Publication $PUB_NAME not found on replica"
    exit 1
fi

echo "Publication $PUB_NAME found on replica"

echo "Creating subscription $SUB_NAME"

psql -h localhost -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE SUBSCRIPTION $SUB_NAME CONNECTION 'host=$REPLICA_HOST port=$REPLICA_PORT user=$REPLICA_USER password=$REPLICA_PASSWORD dbname=$POSTGRES_DB' PUBLICATION $PUB_NAME WITH (ORIGIN = NONE);"

echo "Subscription $SUB_NAME created"

