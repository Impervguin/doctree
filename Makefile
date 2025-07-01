DOCKER:=docker
COMPOSE_DEV:=deployments/docker-compose.dev.yaml
COMPOSE_PROD:=deployments/docker-compose.yaml
COMPOSE_ENV:=deployments/compose.env

define compose_file
	$(if $(findstring dev-,$(1)),$(COMPOSE_DEV),$(COMPOSE_PROD))
endef


.PHONY: up, upd, upda, dev-up, dev-upd, dev-upda

%up:
	$(DOCKER) compose --env-file $(COMPOSE_ENV) -f $(call compose_file,$@) up -d --build

%upd:
	$(DOCKER) compose --env-file $(COMPOSE_ENV) -f $(call compose_file,$@) up -d --build

%upda: 
	$(DOCKER) compose --env-file $(COMPOSE_ENV) -f $(call compose_file,$@) up -d --build

%down:
	$(DOCKER) compose --env-file $(COMPOSE_ENV) -f $(call compose_file,$@) down