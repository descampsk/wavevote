pragma solidity ^0.4.3;

contract WaveVoteContractRegistery {
	address public owner;
	
    address public lastWaveVoteContractAddress;
    address[] public previousWaveVoteContractAddressList; 
    string public lastWaveVoteAbi;
    string[] public previousAbiWaveVoteList;
    
    address public lastLocalCryptoAddress;
    address[] public previousLocalCryptoAddressList; 
    string public lastLocalCryptoAbi;
    string[] public previousAbiLocalCryptoList;

    function WaveVoteContractRegistery() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if(owner != msg.sender) throw;
        _;
    }

    function changeWaveVoteContract(address newAddress, string newAbi) public onlyOwner() returns (bool)
    {
        if(newAddress != lastWaveVoteContractAddress) {
        	previousWaveVoteContractAddressList.push(lastWaveVoteContractAddress);
        	lastWaveVoteContractAddress = newAddress;
                
        	previousAbiWaveVoteList.push(lastWaveVoteAbi);
        	lastWaveVoteAbi = newAbi;
            
            return true;
        }

        return false;
    }
    
    function changeLocalCryptoContract(address newAddress, string newAbi) public onlyOwner() returns (bool)
    {
        if(newAddress != lastLocalCryptoAddress) {
        	previousWaveVoteContractAddressList.push(lastLocalCryptoAddress);
        	lastLocalCryptoAddress = newAddress;
                
        	previousAbiLocalCryptoList.push(lastLocalCryptoAbi);
        	lastLocalCryptoAbi = newAbi;
            
            return true;
        }

        return false;
    }
}