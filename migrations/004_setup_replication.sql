-- +goose Up
-- +goose StatementBegin

-- Create replication user on master
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'replicator_pass';

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE doctree TO replicator;
GRANT USAGE ON SCHEMA public TO replicator;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO replicator;
GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO replicator;

-- Create publication for all tables
CREATE PUBLICATION doctree_pub FOR TABLE
app_admin, app_user, document_relations, documents, documents_files, documents_nodes, documents_tags, files, node_closure, nodes, parse_schedulers, parsed_files;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

-- Drop publication
DROP PUBLICATION IF EXISTS doctree_pub;

-- Drop replication user
DROP USER IF EXISTS replicator;

-- +goose StatementEnd