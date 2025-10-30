-- +goose Up
-- +goose StatementBegin

-- Create replication user on master
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'replicator_pass';

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE doctree TO replicator;

-- Create publication for all tables
CREATE PUBLICATION doctree_pub FOR ALL TABLES;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

-- Drop publication
DROP PUBLICATION IF EXISTS doctree_pub;

-- Drop replication user
DROP USER IF EXISTS replicator;

-- +goose StatementEnd