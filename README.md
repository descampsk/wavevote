# WaveVote

WaveVote is a voting system based on Ethereum. It's inspired from and base of the work of https://github.com/stonecoldpat/anonymousvoting. Thanks for his amazing job.

## How to install the WaveVote client ?
```
1 - git clone <location> https://github.com/descampsk/wavevote/
2 - cd \<location\>/WaveVote_Electron<br>
3 - npm install
4 - npm start
5 - To build an executable : npm make
```

### Prerequisites

#### Private Blockchain

You need to have a private Ethereum Blockchain that is installed.<br>
To do it quickly, you can use docker and this command : 
```
docker run -it --net=host --rm -v blockchain-volume-dev:/root/ kdwavestone/ethereum-node-votant:v2
```

#### How to install the Smart Contract ?
1 - Install Ethereum-Wallet/Mist : https://github.com/ethereum/mist/releases<br> <b>Warning</b> : the version must be under 0.9.0 or you won't be able to compile the contract.<br>

