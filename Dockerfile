## Base
FROM php:8.4-fpm

## Non-interactive apt
ENV DEBIAN_FRONTEND=noninteractive

## System deps and PHP build deps
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends \
      curl \
      git \
      zip \
      unzip \
      net-tools \
      iputils-ping \
      telnet \
      mc \
      nano \
      lsb-release \
      ca-certificates \
      apt-transport-https \
      build-essential; \
    rm -rf /var/lib/apt/lists/*

## Node.js + yarn + grunt-cli + bower
RUN set -eux; \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -; \
    apt-get install -y --no-install-recommends nodejs; \
    npm install -g yarn grunt-cli bower --unsafe-perm=true --allow-root; \
    rm -rf /var/lib/apt/lists/*

## Xdebug (install and basic config)
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends $PHPIZE_DEPS; \
    pecl install xdebug; \
    docker-php-ext-enable xdebug; \
    rm -rf /tmp/pear; \
    apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false $PHPIZE_DEPS; \
    { \
      echo "xdebug.mode=debug"; \
      echo "xdebug.start_with_request=yes"; \
      echo "xdebug.client_host=host.docker.internal"; \
      echo "xdebug.client_port=9003"; \
      echo "xdebug.log=/tmp/xdebug.log"; \
      echo "xdebug.log_level=3"; \
    } > /usr/local/etc/php/conf.d/99-xdebug.ini

## Composer (from official image)
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

## Xdebug environment defaults
ENV XDEBUG_MODE=debug \
    XDEBUG_CONFIG="client_host=host.docker.internal client_port=9003" \
    PHP_IDE_CONFIG="serverName=local.docker"

## Pass-through envs in FPM pool
RUN set -eux; \
    { \
      echo ""; \
      echo "clear_env = yes"; \
      echo "env[APP_ENV] = \$APP_ENV"; \
      echo "env[XDEBUG_CONFIG] = \$XDEBUG_CONFIG"; \
      echo "env[XDEBUG_MODE] = \$XDEBUG_MODE"; \
      echo "env[PHP_IDE_CONFIG] = \$PHP_IDE_CONFIG"; \
    } >> /usr/local/etc/php-fpm.d/www.conf

## Workdir and permissions
WORKDIR /app
RUN chown -R www-data:www-data /app

## Entrypoint
CMD ["php-fpm"]
