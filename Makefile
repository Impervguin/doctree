DOCKER:=docker
COMPOSE_DEV:=deployments/docker-compose.dev.yaml
COMPOSE_PROD:=deployments/docker-compose.yaml
COMPOSE_ENV:=deployments/compose.env

define compose_file
	$(if $(findstring dev-,$(1)),$(COMPOSE_DEV),$(COMPOSE_PROD))
endef


%up:
	$(DOCKER) compose --env-file $(COMPOSE_ENV) -f $(call compose_file,$@) up -d

%upd:
	$(DOCKER) compose --env-file $(COMPOSE_ENV) -f $(call compose_file,$@) up -d --build

%upda: 
	$(DOCKER) compose --env-file $(COMPOSE_ENV) -f $(call compose_file,$@) up --build

%down:
	$(DOCKER) compose --env-file $(COMPOSE_ENV) -f $(call compose_file,$@) down

.PHONY: example

example:
	python3 ./scripts/exampler.py --dirs ./deployments \
    --extensions .yaml .env \
    --suffix .example \
    --exclude docker-compose \
    --override