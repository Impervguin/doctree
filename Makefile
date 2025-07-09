include .env
export $(shell sed 's/=.*//' .env)

DOCKER:=docker
COMPOSE_DEV:=deployments/docker-compose.dev.yaml
COMPOSE_PROD:=deployments/docker-compose.yaml
COMPOSE_ENV:=deployments/compose.env
CONTAINERS:=doctree-postgres doctree-minio doctree-postgres-migrator

define compose_file
	$(if $(findstring dev-,$(1)),$(COMPOSE_DEV),$(COMPOSE_PROD))
endef

start:
	npm run start

dev-start:
	npm run start:dev

%up:
	$(DOCKER) compose --env-file $(COMPOSE_ENV) -f $(call compose_file,$@) up -d $(CONTAINERS)

%upd:
	$(DOCKER) compose --env-file $(COMPOSE_ENV) -f $(call compose_file,$@) up -d --build $(CONTAINERS)

%upda: 
	$(DOCKER) compose --env-file $(COMPOSE_ENV) -f $(call compose_file,$@) up --build $(CONTAINERS)

%down:
	$(DOCKER) compose --env-file $(COMPOSE_ENV) -f $(call compose_file,$@) down 

.PHONY: example

example:
	python3 ./scripts/exampler.py --dirs ./deployments \
    --extensions .yaml .env \
    --suffix .example \
    --exclude docker-compose \
    --override