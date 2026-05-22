#!/bin/sh
set -e

cleanup() {
  docker compose -f docker-compose.component.yml down -v --remove-orphans
}

trap cleanup EXIT

docker compose -f docker-compose.component.yml down -v --remove-orphans
docker compose -f docker-compose.component.yml up -d --build postgres-test mountebank sut-api

SUT_CONTAINER_ID=$(docker compose -f docker-compose.component.yml ps -q sut-api)

until [ "$(docker inspect --format '{{.State.Health.Status}}' "$SUT_CONTAINER_ID")" = "healthy" ]; do
  sleep 1
done

docker compose -f docker-compose.component.yml run --rm component-test-runner
