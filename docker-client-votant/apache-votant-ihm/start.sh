#!/bin/bash
echo $DOCKER_HOST
DOCKER_HOST="$(echo ${DOCKER_HOST} | cut -d: -f2 | cut -d '/' -f3)"
echo $DOCKER_HOST | cat -A 
sed -i "s/localhost/${DOCKER_HOST}/g" /var/www/html/index.html
sed -i "s/localhost/${DOCKER_HOST}/g" /var/www/html/admin.html
/usr/sbin/apache2ctl -D FOREGROUND
