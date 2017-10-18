# WaveVote

WaveVote is a voting system based on Ethereum. It is inspired and is based on the work of https://github.com/stonecoldpat/<br>
You can find his work here : https://github.com/stonecoldpat/anonymousvoting.<br>
Thanks for his amazing job.<br>

Based of this work, WaveVote :<br>
- Removed the limit of 40 voters<br>
- Removed the obligation of all voters to vote => secret is now corrupted by the administrator<br>
- Add a distributed administration => keep all secret safe until all administrators are corrupted. If one administrator is safe, then all secrets are safe <b>(NOT IMPLEMENTED YET)</b><br>
- Add the possibility to organize a multi-candidates election<br>
- Cryptography is now hidden in the client<br>
- Use Electron to create a user friendly application<br> 
- Many others things ...

## I want directly test the WaveVote Client ! 
It's possible. <br>
To achieve this, you have to download VirtualBox here : https://www.virtualbox.org/wiki/Downloads<br>
Then, you need to download a Virtual Box LUbuntu image, which contains the client and a local private Ethereum Blockchain which mines automatically. You will find the image here : <br>
Last thing, import the image into VirtualBox and let's have fun ! The administrator's password is : Vote

## How to install the WaveVote client ?
```
1 - git clone <location> https://github.com/descampsk/wavevote/
2 - cd \<location\>/WaveVote_Electron
3 - npm install
4 - npm start
5 - To build an executable : electron-forge make
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
2 - Compile and upload the 3 contracts : WaveVote.sol, LocalCrypto.sol and WaveVoteContractRegistry.sol.<br>
3 - 
