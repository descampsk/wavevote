from eboraas/apache

ENV DOCKER_HOST None

COPY Web3/ /var/www/html
COPY start.sh /root/start.sh

EXPOSE 8545

CMD ["bin/bash", "/root/start.sh"]
