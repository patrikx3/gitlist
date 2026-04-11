#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$DIR"

trap 'docker compose down' EXIT INT TERM

bash docker-build.sh
bash docker-start.sh
bash docker-init.sh

docker compose logs -f
