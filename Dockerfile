#docker login
#docker build -t patrikx3/p3x-gitlist .
##docker tag IMAGE_ID patrikx3/p3x-gitlist:latest
#docker push patrikx3/p3x-gitlist:latest
#docker tag IMAGE_ID patrikx3/p3x-gitlist:2019.10.525
#docker push patrikx3/p3x-gitlist
#docker images
#docker rmi -f IMAGE_ID
FROM ubuntu:latest
MAINTAINER patrikx3/p3x-gitlist - Patrik Laszlo
ENV COMPOSER_PROCESS_TIMEOUT=3600
ENV DEBIAN_FRONTEND=noninteractive
#ENV P3XRS_DOCKER_HOME=/settings

RUN apt-get -y update
RUN apt-get -y install git
RUN apt-get -y install php --allow-unauthenticated
RUN apt-get -y install php-fpm --allow-unauthenticated
RUN apt-get -y install nginx
RUN apt-get -y install curl
RUN apt-get -y install git
RUN apt-get -y install composer
#RUN apt-get install -y build-essential

# node
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get -y install nodejs
RUN node -v


ADD ./build/p3x-gitlist /gitlist


RUN mkdir -p /run/php
RUN echo "cgi.fix_pathinfo = 0;" >> /etc/php/7.4/fpm/php.ini
RUN echo "max_input_vars = 10000;" >> /etc/php/7.4/fpm/php.ini
RUN echo "max_execution_time = 10000;" >> /etc/php/7.4/fpm/php.ini
RUN echo "date.timezone = Europe/Budapest;" >> /etc/php/7.4/fpm/php.ini
RUN sed -i 's/;daemonize = yes/daemonize = no/g' /etc/php/7.4/fpm/php-fpm.conf

RUN chown -R www-data:www-data /gitlist
RUN chown -R www-data:www-data /var/git


EXPOSE 12345
#CMD p3x-redis
