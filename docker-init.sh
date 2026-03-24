#!/usr/bin/env bash
docker exec -i php-fpm-gitlist bash -c "cd /app && bash docker-init-execute.sh"
