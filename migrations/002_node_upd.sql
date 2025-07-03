-- +goose Up
-- +goose StatementBegin

ALTER TABLE nodes RENAME COLUMN node_id TO parent_id;
ALTER TABLE nodes ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

ALTER TABLE nodes RENAME COLUMN parent_id TO node_id;
ALTER TABLE nodes ALTER COLUMN id DROP DEFAULT;

-- +goose StatementEnd

