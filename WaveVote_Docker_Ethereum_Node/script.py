import os
import subprocess
import shutil

print("Checking if a ethereum database already exists ...")
if (os.path.exists(os.environ.get('CHAINDATA_PATH'))):
    print("A ethereum database already exists. No need to initialize")
else:
    print("No ethereum database has been found")
    print("Initializing the ethereum database from the genesis file ...")
    subprocess.run(["geth", "init", os.environ.get('GENESIS_PATH', '/root') + "/genesis.json"])
    print("Ethereum database created")
    shutil.copy2(os.environ.get('STATIC_NODES_PATH','/root')+"/static-nodes.json","/root/.ethereum/static-nodes.json")

subprocess.run(["geth", "--networkid", os.environ.get("NETWORKID"), "--rpc", "--rpcapi" , "db,eth,net,web3,personal,web3", "--rpcaddr", "0.0.0.0"])  





