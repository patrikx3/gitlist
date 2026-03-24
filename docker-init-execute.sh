#!/usr/bin/env bash
set -e

# Fix git dubious ownership (container runs as root, repos owned by host user)
# Use system gitconfig so it applies to all users including www-data (php-fpm)
git config --system --add safe.directory '*'

# Install Node.js dependencies
yarn install

# Install PHP dependencies
export COMPOSER_PROCESS_TIMEOUT=6000
composer install --ignore-platform-reqs

# Build frontend assets (less + webpack)
# Fix ownership of prod dir so grunt can clean/write it
chown -R 1000:1000 public/prod 2>/dev/null || true
grunt

# Copy Docker config if config.ini does not exist
if [ ! -f config.ini ]; then
    cp config.docker.ini config.ini
fi

# Clear twig cache (stale compiled templates may reference old webpack hashes)
rm -rf cache/views/*

# Ensure cache directory exists and is writable by www-data (php-fpm)
mkdir -p cache
chown -R www-data:www-data cache
chmod -R 777 cache
