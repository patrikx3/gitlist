#!/usr/bin/env bash
set -e
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

bash docker-build.sh
bash docker-start.sh
bash docker-init.sh

trap 'docker compose down' EXIT INT TERM
docker compose logs -f
