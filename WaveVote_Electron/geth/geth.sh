#!/usr/bin/env bash
echo "Starting geth"
screen -dmS geth /usr/bin/geth --networkid 9876 --rpc --rpcapi db,eth,net,web3,personal,web3 --mine --minerthreads 1  2>> /var/log/geth.log