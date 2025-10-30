#!/bin/bash
set -e

# Check if replication is already configured
if grep -q "host replication replicator" /var/lib/postgresql/data/pg_hba.conf; then
  echo "Replication already configured in pg_hba.conf"
  exit 0
fi

echo "Configuring master for replication..."

# Add replication entry to pg_hba.conf
echo "host replication replicator 0.0.0.0/0 md5" >> /var/lib/postgresql/data/pg_hba.conf

# Reload PostgreSQL configuration
PGPASSWORD=$POSTGRES_PASSWORD psql -h localhost -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT pg_reload_conf();"

echo "Master replication configuration completed"