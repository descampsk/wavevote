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
    yn = input("Do you have already an ethereum wallet? [yes/no]").lower()
    if (yn=="yes" or yn =="y"):
        print("ok")
    else:
        print("Creation of a new wallet")
        subprocess.run(["geth", "account", "new"])
        input("Please take note of your public address account and press enter to continue...")

		
yn = input("Do you want to activate the rpc connection? [yes/no]").lower()
if (yn=="yes" or yn =="y"):
    subprocess.run(["geth", "--networkid", os.environ.get("NETWORKID"), "--rpc", "--rpcapi" , "db,eth,net,web3,personal,web3", "--rpcaddr", "0.0.0.0"])  
else:
	subprocess.run(["geth", "--networkid", os.environ.get("NETWORKID")]) 




