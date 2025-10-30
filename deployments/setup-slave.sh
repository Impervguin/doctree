#!/bin/bash
set -e

# Wait for master to be ready
until pg_isready -h $MASTER_HOST -p $MASTER_PORT -U $MASTER_USER; do
  echo "Waiting for master database..."
  sleep 2
done

# Create replication slot if it doesn't exist
PGPASSWORD=$MASTER_PASSWORD psql -h $MASTER_HOST -U $MASTER_USER -d $POSTGRES_DB -c "SELECT pg_create_physical_replication_slot('doctree_slot') WHERE NOT EXISTS (SELECT 1 FROM pg_replication_slots WHERE slot_name = 'doctree_slot');"

echo "Created replication slot"

# Create base backup from master
PGPASSWORD=replicator_pass pg_basebackup -h $MASTER_HOST -D $PGDATA -U replicator -v -P --wal-method=stream

# Create standby.signal file to enable standby mode
touch $PGDATA/standby.signal

# Configure recovery
cat > $PGDATA/postgresql.auto.conf << EOF
primary_conninfo = 'host=pg port=5432 user=replicator password=replicator_pass'
primary_slot_name = 'doctree_slot'
EOF

echo "Slave setup completed"