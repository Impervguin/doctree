package main

import (
	"errors"
	"flag"
	"fmt"
	"migrator/migrator"
	"os"

	"github.com/golang-migrate/migrate/v4"
	"github.com/spf13/viper"
)

var (
	AvailableCommands = map[string]string{
		"up":     "Migrate up from current version to latest",
		"down":   "Migrate down from current version to 0",
		"upto":   "Migrate up to version (inclusive). Version must be higher than current version. Version must be specified with -version",
		"downto": "Migrate down to version (inclusive). Version must be lower than current version. Version must be specified with -version",
	}
)

const (
	MigrationDirKey = "migration_dir"
	DatabaseKey     = "database"
	UserKey         = "user"
	PasswordKey     = "password"
	HostKey         = "host"
	PortKey         = "port"

	DatabasePrefix  = "db"
	MigrationPrefix = "migration"
)

func Key(prefix string, name string) string {
	return fmt.Sprintf("%s.%s", prefix, name)
}

func Help() {
	fmt.Printf("Usage: %s <options> <command>\n", os.Args[0])
	fmt.Println("Available commands:")
	for cmd, desc := range AvailableCommands {
		fmt.Printf("  %s: %s\n", cmd, desc)
	}
	fmt.Println("Options:")
	flag.PrintDefaults()
}

func initMigrator(configFile string) (*migrator.Migrator, error) {
	viper.SetConfigFile(configFile)
	if err := viper.ReadInConfig(); err != nil {
		return nil, err
	}

	config := migrator.Config{
		MigrationDir: viper.GetString(Key(MigrationPrefix, MigrationDirKey)),
		Database:     viper.GetString(Key(DatabasePrefix, DatabaseKey)),
		User:         viper.GetString(Key(DatabasePrefix, UserKey)),
		Password:     viper.GetString(Key(DatabasePrefix, PasswordKey)),
		Host:         viper.GetString(Key(DatabasePrefix, HostKey)),
		Port:         viper.GetInt(Key(DatabasePrefix, PortKey)),
	}
	migrator, err := migrator.NewMigrator(&config)
	if err != nil {
		return nil, err
	}
	return migrator, nil
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Invalid usage. See --help")
	}

	help := flag.Bool("help", false, "Show help")
	config := flag.String("config", "", "Config file")
	version := flag.Uint("version", 0, "Migrate to version")
	flag.Parse()

	if *help {
		Help()
		os.Exit(0)
	}

	if *config == "" {
		fmt.Println("Config file is required. See --help")
		os.Exit(1)
	}

	migrator, err := initMigrator(*config)
	if err != nil {
		fmt.Printf("Failed to init migrator: %v\n", err)
		os.Exit(1)
	}

	args := flag.Args()
	if len(args) < 1 {
		fmt.Println("Invalid usage: command is required. See --help")
		os.Exit(1)
	}

	switch args[0] {
	case "up":
		err = migrator.Up()
		if errors.Is(err, migrate.ErrNoChange) {
			fmt.Println("No change")
			os.Exit(0)
		} else if err != nil {
			panic(err)
		}
	case "down":
		err = migrator.Down()
		if err != nil {
			panic(err)
		}
	case "upto":
		if version == nil {
			fmt.Println("Version is required. See --help")
			os.Exit(1)
		}

		err = migrator.UpTo(*version)
		if err != nil {
			panic(err)
		}
	case "downto":
		if version == nil {
			fmt.Println("Version is required. See --help")
			os.Exit(1)
		}

		err = migrator.DownTo(*version)
		if err != nil {
			panic(err)
		}
	case "version":
		version, dirty, err := migrator.Version()
		if err != nil {
			panic(err)
		}
		fmt.Printf("Current version: %d\n", version)
		if dirty {
			fmt.Println("Dirty database")
		}
	default:
		fmt.Printf("Invalid command: %s\n", args[0])
	}
}
