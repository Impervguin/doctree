CREATE TABLE IF NOT EXISTS nodes (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    node_id UUID,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,

    CONSTRAINT fk_nodes_node_id FOREIGN KEY (node_id) REFERENCES nodes (id),
    CONSTRAINT created_at_before CHECK (created_at <= updated_at),
    CONSTRAINT updated_at_before CHECK (updated_at <= deleted_at)
);

CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,

    CONSTRAINT created_at_before CHECK (created_at <= updated_at),
    CONSTRAINT updated_at_before CHECK (updated_at <= deleted_at)
);

CREATE TABLE IF NOT EXISTS documents_nodes (
    document_id UUID NOT NULL,
    node_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,

    PRIMARY KEY (document_id, node_id),
    CONSTRAINT fk_documents_nodes_document_id FOREIGN KEY (document_id) REFERENCES documents (id),
    CONSTRAINT fk_documents_nodes_node_id FOREIGN KEY (node_id) REFERENCES nodes (id),
    CONSTRAINT created_at_before CHECK (created_at <= updated_at),
    CONSTRAINT updated_at_before CHECK (updated_at <= deleted_at)
);

CREATE TYPE document_relation AS ENUM (
    'used_by'
);

CREATE TABLE IF NOT EXISTS document_relations (
    document_id0 UUID NOT NULL,
    document_id1 UUID NOT NULL,
    relation document_relation NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,

    PRIMARY KEY (document_id0, document_id1, relation),
    CONSTRAINT fk_document_relations_document_id0 FOREIGN KEY (document_id0) REFERENCES documents (id),
    CONSTRAINT fk_document_relations_document_id1 FOREIGN KEY (document_id1) REFERENCES documents (id),
    CONSTRAINT created_at_before CHECK (created_at <= updated_at),
    CONSTRAINT updated_at_before CHECK (updated_at <= deleted_at),
    CONSTRAINT no_selfreference CHECK (document_id0 <> document_id1)
);

CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL, -- logical name of the file
    description TEXT,
    filename TEXT NOT NULL, -- os name of the file
    filepath TEXT NOT NULL, -- bucket or path to file
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,

    CONSTRAINT created_at_before CHECK (created_at <= updated_at),
    CONSTRAINT updated_at_before CHECK (updated_at <= deleted_at)
);

CREATE TABLE IF NOT EXISTS documents_files (
    document_id UUID NOT NULL,
    file_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP,

    PRIMARY KEY (document_id, file_id),
    CONSTRAINT fk_documents_files_document_id FOREIGN KEY (document_id) REFERENCES documents (id),
    CONSTRAINT fk_documents_files_file_id FOREIGN KEY (file_id) REFERENCES files (id),
    CONSTRAINT created_at_before CHECK (created_at <= updated_at),
    CONSTRAINT updated_at_before CHECK (updated_at <= deleted_at)
);


