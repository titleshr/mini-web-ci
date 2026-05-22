#!/bin/sh
set -e

cleanup() {
  echo "Cleaning component test environment..."
  docker compose -f docker-compose.component.yml down -v --remove-orphans
}

trap cleanup EXIT

docker compose -f docker-compose.component.yml up --build --abort-on-container-exit --exit-code-from component-test-runner