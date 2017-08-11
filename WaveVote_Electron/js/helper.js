/**
 * @file This file contains all useful variables and constants for the admin JS and vote JS.
 */

//Define the require
 var $;
 var BigNumber;
 var EC;
 var ec;
 var winston;
 var Web3;
 var jQuery;
 
 function initRequire() {
	 try {
		 /*
		 if (typeof module === 'object') {window.module = module; module = undefined;}
		 $ = require('jquery');
		 if (window.module) module = window.module;
		 */
		 $ = jQuery;
		 BigNumber = require('bignumber.js');
		 //Create and initialize EC context 
		 //(better do it once and reuse it) 
		 EC = require('elliptic').ec;
		 ec = new EC('secp256k1');
		 winston = require('winston');
		 Web3 = require('web3');
		 console.log("Initialisation of require : ok");
		 return true;
	 } catch(e) {
		 console.log("Initialisation of require : error");
		 console.log(e);
		 alert("Error : please contact an administrator");
		 return false;
	 }
 }
 
 //use that function to either use the development path OR the production prefix to your file location
 const path = require("path");
 
var config = require(path.join(__dirname, "../config/config.json"));
console.log(config);

var paramUrl; 
var addrProvider;
try {
	paramUrl = location.search.substring(1);
	console.log("ParamUrl : " + paramUrl);
	addrProvider= paramUrl.split('=')[1];
} catch(e) {
	console.log(e);
	alert(e);
	addrProvider = config.addrProvider;
}
console.log("AddrProvider : " + addrProvider);
 
 var result = initRequire();
 var web3;
 var anonymousvotingAddr;
 var WaveVoteAddr;
 var cryptoAddr; 
 if(result) {
	//Loging
	 winston.configure({
		    transports: [
		      new (winston.transports.File)({ 
		    	  filename: 'log.log',
		    	    handleExceptions: true,
		    	    humanReadableUnhandledException: true
		    	    })
	    ]
	  });
	 winston.level = 'debug';
	 
	if (typeof web3 !== 'undefined') {
	  web3 = new Web3(web3.currentProvider);
	  console.log("The current provider is defined.")
	} else {
	  // set the provider you want from Web3.providers
	  web3 = new Web3(new Web3.providers.HttpProvider("http://" + addrProvider));
	  console.log("Http provider is defined : " + addrProvider);
	}

	console.log("Init Helper.js ok")
 }
 
function initContracts() {
	var WaveVoteContractRegistryAddress = config.WaveVoteContractRegistryAddress;
	if(WaveVoteContractRegistryAddress==undefined) {
		WaveVoteContractRegistryAddress="0xe73B1eBf7190A66e2b07F39A8cF9A117Db4d2740";
	}
	
	var abiWaveVoteContractRegistry = [ { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "previousLocalCryptoAddressList", "outputs": [ { "name": "", "type": "address", "value": "0x" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "lastWaveVoteAbi", "outputs": [ { "name": "", "type": "string", "value": "" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newAddress", "type": "address" }, { "name": "newAbi", "type": "string" } ], "name": "changeLocalCryptoContract", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "previousAbiLocalCryptoList", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "lastLocalCryptoAbi", "outputs": [ { "name": "", "type": "string", "value": "" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "lastWaveVoteContractAddress", "outputs": [ { "name": "", "type": "address", "value": "0x0000000000000000000000000000000000000000" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "lastLocalCryptoAddress", "outputs": [ { "name": "", "type": "address", "value": "0x0000000000000000000000000000000000000000" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "previousWaveVoteContractAddressList", "outputs": [ { "name": "", "type": "address", "value": "0x" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newAddress", "type": "address" }, { "name": "newAbi", "type": "string" } ], "name": "changeWaveVoteContract", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "previousAbiWaveVoteList", "outputs": [ { "name": "", "type": "string" } ], "payable": false, "type": "function" }, { "inputs": [], "payable": false, "type": "constructor" } ];
	var WaveVoteContractRegistry = web3.eth.contract(abiWaveVoteContractRegistry);
	var WaveVoteContractRegistryAddr = WaveVoteContractRegistry.at(WaveVoteContractRegistryAddress);
	return initWaveVoteContract(WaveVoteContractRegistryAddr) && initLocalCryptoContract(WaveVoteContractRegistryAddr);
}

function initWaveVoteContract(WaveVoteContractRegistryAddr) {
	try {
		// Anonymous Voting Contract
		var abiWaveVoteStr = WaveVoteContractRegistryAddr.lastWaveVoteAbi();
		var abiWaveVote = JSON.parse(abiWaveVoteStr);
		console.log(abiWaveVote)
		var WaveVote = web3.eth.contract(abiWaveVote);
		WaveVoteAddr = WaveVote.at(WaveVoteContractRegistryAddr.lastWaveVoteContractAddress());
		if(WaveVoteAddr.owner()==="0x"){
			console.log("WaveVoteContract no found ! Please contact an administrator");
			return false;
		} else {
			console.log("WaveVoteAddr is defined");
			return true;
		}
	} catch(e) {
		console.log(e);
		return false;
	}
}

function initLocalCryptoContract(WaveVoteContractRegistryAddr) {
	try {
		// Local Crypto Contract
		var abi_crypto_str = WaveVoteContractRegistryAddr.lastLocalCryptoAbi();
		var abi_crypto = JSON.parse(abi_crypto_str);
		var crypto_contract = web3.eth.contract(abi_crypto);
		cryptoAddr = crypto_contract.at(WaveVoteContractRegistryAddr.lastLocalCryptoAddress());
		console.log("CryptoAddr is defined");
		return true;
	} catch(e) {
		console.log(e);
		return false;
	}
}
 


/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return isChecksumAddress(address);
    }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
var isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};

function clockformat(date) {
	   var mins;
	   if(date.getMinutes() < 10) {
	     mins = "0" + date.getMinutes();
	   } else {
	     mins = date.getMinutes();
	   }

	   var toString = date.getHours() + ":" + mins + ", "

	   toString = toString + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

	   return toString;
	}