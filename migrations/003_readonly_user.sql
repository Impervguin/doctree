-- +goose Up
-- +goose StatementBegin

CREATE USER readonly_user WITH PASSWORD 'readonly_pass';
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly_user;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM readonly_user;
REVOKE USAGE ON SCHEMA public FROM readonly_user;
DROP USER IF EXISTS readonly_user;

-- +goose StatementEnd