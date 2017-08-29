from ethereum/client-go:v1.6.6

RUN apk add --update \
		bash \
		python3 \
	&& rm -rf /var/cache/apk/*
	
ENV NETWORKID 4545
ENV CHAINDATA_PATH /root/.ethereum/geth/chaindata/
ENV GENESIS_PATH /temp/
ENV STATIC_NODES_PATH /temp/
ENV DOCKER_HOST=NONE

COPY genesis.json /temp/genesis.json

COPY static-nodes.json /temp/static-nodes.json

COPY script.py /script/script.py

ENTRYPOINT []
CMD ["python3", "/script/script.py"]
