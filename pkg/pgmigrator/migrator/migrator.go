package migrator

import (
	"fmt"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

type Migrator struct {
	config Config
}

func NewMigrator(config *Config) (*Migrator, error) {
	if err := config.Validate(); err != nil {
		return nil, fmt.Errorf("invalid config: %w", err)
	}
	return &Migrator{
		config: *config,
	}, nil
}

func (m *Migrator) init() (*migrate.Migrate, error) {
	sourceUrl := fmt.Sprintf("file://%s", m.config.MigrationDir)
	dbUrl := fmt.Sprintf("postgres://%s:%s@%s:%d/%s?sslmode=disable", m.config.User, m.config.Password, m.config.Host, m.config.Port, m.config.Database)
	mig, err := migrate.New(sourceUrl, dbUrl)
	if err != nil {
		return nil, err
	}

	log := NewLogger()

	mig.Log = log
	return mig, nil
}

func (m *Migrator) Up() error {
	mig, err := m.init()
	if err != nil {
		return fmt.Errorf("failed to init migrate: %w", err)
	}
	defer mig.Close()

	err = mig.Up()
	if err != nil {
		return err
	}
	return nil
}

func (m *Migrator) Down() error {
	mig, err := m.init()
	if err != nil {
		return fmt.Errorf("failed to init migrate: %w", err)
	}
	defer mig.Close()

	err = mig.Down()
	if err != nil {
		return err
	}
	return nil
}

func (m *Migrator) DownTo(version uint) error {
	mig, err := m.init()
	if err != nil {
		return fmt.Errorf("failed to init migrate: %w", err)
	}
	defer mig.Close()

	currentVersion, dirty, err := mig.Version()
	if err != nil {
		return fmt.Errorf("failed to get current version: %w", err)
	}

	if dirty {
		return fmt.Errorf("dirty database")
	}

	if currentVersion < version {
		return fmt.Errorf("current version %d is lower than target version %d", currentVersion, version)
	}

	diff := currentVersion - version

	err = mig.Steps(-int(diff))
	if err != nil {
		return err
	}
	return nil
}

func (m *Migrator) UpTo(version uint) error {
	mig, err := m.init()
	if err != nil {
		return fmt.Errorf("failed to init migrate: %w", err)
	}
	defer mig.Close()

	currentVersion, dirty, err := mig.Version()
	if err != nil {
		return fmt.Errorf("failed to get current version: %w", err)
	}

	if dirty {
		return fmt.Errorf("dirty database")
	}

	if currentVersion > version {
		return fmt.Errorf("current version %d is higher than target version %d", currentVersion, version)
	}

	diff := version - currentVersion

	err = mig.Steps(int(diff))
	if err != nil {
		return err
	}
	return nil
}

func (m *Migrator) Version() (version uint, dirty bool, err error) {
	mig, err := m.init()
	if err != nil {
		return 0, false, fmt.Errorf("failed to init migrate: %w", err)
	}
	defer mig.Close()

	return mig.Version()
}
