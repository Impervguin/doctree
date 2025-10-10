-- +goose Up
-- +goose StatementBegin

ALTER TABLE app_user ADD COLUMN is_two_factor_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE app_user ADD COLUMN login_attempts INTEGER NOT NULL DEFAULT 0;
ALTER TABLE app_user ADD COLUMN is_locked BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE app_user ADD COLUMN is_temp_user BOOLEAN NOT NULL DEFAULT false;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

ALTER TABLE app_user DROP COLUMN is_two_factor_enabled;
ALTER TABLE app_user DROP COLUMN login_attempts;
ALTER TABLE app_user DROP COLUMN is_locked;
ALTER TABLE app_user DROP COLUMN is_temp_user;

-- +goose StatementEnd

