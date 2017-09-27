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
 
 function initRequire() {
	 try {
		 $ = require('jquery')
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
 
 //create a function which returns true or false to recognize a development environment
 const isProd = () => process.env.NODE_ENV === 'production';
 console.log("Env is prod : " + isProd());
 console.log("Env : "); 
 console.log(process.env);
 //use that function to either use the development path OR the production prefix to your file location
 const directory = isProd() ? 'resources/app' : './';
 console.log("Directory : " + directory);
 
var paramUrl; 
var addrProvider;
try {
	paramUrl = location.search.substring(1);
	console.log("ParamUrl : " + paramUrl);
	addrProvider= paramUrl.split('=')[1];
} catch(e) {
	console.log(e);
	alert(e);
	  if(isProd()) {
		  addrProvider = "localhost:8545";
	  } else {
		  addrProvider = "192.168.99.100:8545";
	  }
}
console.log("AddrProvider : " + addrProvider);
 
 var result = initRequire();
 var web3;
 var anonymousvotingAddr;
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

	// Anonymous Voting Contract
	var abi = [ { "constant": false, "inputs": [ { "name": "personalPublicKey", "type": "uint256[2]" }, { "name": "inscriptionCode", "type": "bytes32" } ], "name": "askForRegistration", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "addr", "type": "address" } ], "name": "sendOneEtherToVoter", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "computeTally", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "hasReceivedOneEther", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "addressid", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "point", "type": "uint256[2]" } ], "name": "discretLogarithme", "outputs": [ { "name": "_successful", "type": "bool", "value": false }, { "name": "_message", "type": "string", "value": "The point was null" }, { "name": "_result", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "getPeopleToRegister", "outputs": [ { "name": "_registrationAsked", "type": "bool", "value": false }, { "name": "_personalPublicKey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_inscriptionCode", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalRegistrationAsked", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "yG", "type": "uint256[2]" }, { "name": "voteNull", "type": "uint256[2]" }, { "name": "r", "type": "uint256" }, { "name": "vG", "type": "uint256[3]" }, { "name": "vH", "type": "uint256[3]" } ], "name": "verifyZKPNullVote", "outputs": [ { "name": "_successful", "type": "bool", "value": false }, { "name": "_error", "type": "string", "value": "xG or vG or yiG or yivG isnt a PubKey" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_question", "type": "string" }, { "name": "_answerListBytes", "type": "bytes32[]" }, { "name": "_finishSignupPhase", "type": "uint256" }, { "name": "_endSignupPhase", "type": "uint256" }, { "name": "_endVotingPhase", "type": "uint256" } ], "name": "beginSignUp", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "type": "function" }, { "constant": true, "inputs": [], "name": "endSignupPhase", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "finalTally", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "question", "outputs": [ { "name": "", "type": "string", "value": "No question set" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "peopleToRegisterMap", "outputs": [ { "name": "addr", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "registrationAsked", "type": "bool", "value": false }, { "name": "inscriptionCode", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "finishSignupPhase", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "addressToDoNullVote", "type": "address" }, { "name": "nullVote", "type": "uint256[2]" }, { "name": "vG", "type": "uint256[3]" }, { "name": "yvG", "type": "uint256[3]" }, { "name": "r", "type": "uint256" } ], "name": "submitNullVote", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "gap", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getTotalAnswers", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "y", "type": "uint256[3]" }, { "name": "diAndriList", "type": "uint256[2][10]" }, { "name": "aList", "type": "uint256[2][10]" }, { "name": "bList", "type": "uint256[2][10]" } ], "name": "submitVote", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "deadlinePassed", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalvoted", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "computeSumAllVote", "outputs": [ { "name": "_sum", "type": "uint256[2]", "value": [ "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "hasAskedForRegistration", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "addEther", "outputs": [], "payable": true, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x7a4e839863f5862352efd06ab89af8ec72a9e7a5" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "accountToRegister", "type": "address" }, { "name": "adminPublicKey", "type": "uint256[2]" }, { "name": "xG", "type": "uint256[2]" }, { "name": "vG", "type": "uint256[3]" }, { "name": "r", "type": "uint256" } ], "name": "registerAccount", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": true, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "voterMapBis", "outputs": [ { "name": "addr", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "registered", "type": "bool", "value": false }, { "name": "voteCast", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "addressesToRegister", "outputs": [ { "name": "", "type": "address", "value": "0x" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "endVotingPhase", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalRecalculatedKey", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "hasCastVote", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "getVoterBis", "outputs": [ { "name": "_registered", "type": "bool", "value": false }, { "name": "_voteCast", "type": "bool", "value": false }, { "name": "_personalPublicKey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_adminPublicKey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_registeredkey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_reconstructedkey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_vote", "type": "uint256[2]", "value": [ "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "result", "type": "uint256" } ], "name": "manualComputeFinalTally", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "state", "outputs": [ { "name": "", "type": "uint8", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "isRegistered", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "answerList", "outputs": [ { "name": "", "type": "bytes32", "value": "0x" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "result", "type": "uint256" } ], "name": "computeFinalTally", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalregistered", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "forceCancelElection", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "y", "type": "uint256[3]" }, { "name": "res2D", "type": "uint256[2][2]" }, { "name": "diAndriList", "type": "uint256[2][10]" }, { "name": "aList", "type": "uint256[2][10]" }, { "name": "bList", "type": "uint256[2][10]" } ], "name": "verifyZKPVote", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "addresses", "outputs": [ { "name": "", "type": "address", "value": "0x" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "inscriptionCodeUsed", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "r", "type": "uint256" }, { "name": "vG", "type": "uint256[3]" } ], "name": "verifyZKP", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "indexVoter", "type": "uint256" } ], "name": "computeReconstructedKey", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" }, { "name": "_yG", "type": "uint256[2]" } ], "payable": false, "type": "function" }, { "inputs": [ { "name": "_gap", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;gap", "template": "elements_input_uint", "value": "" } ], "payable": true, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "addressVoter", "type": "address" }, { "indexed": false, "name": "_successful", "type": "bool" }, { "indexed": false, "name": "_error", "type": "string" }, { "indexed": false, "name": "_yG", "type": "uint256[2]" } ], "name": "ComputationReconstructedKeyEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": false, "name": "_isVoteCast", "type": "bool" }, { "indexed": false, "name": "_error", "type": "string" } ], "name": "IsVoteCastEvent", "type": "event" } ];
	var anonymousvoting = web3.eth.contract(abi);
	anonymousvotingAddr = anonymousvoting.at("0x6362692668028225C799f19b53153Fa82474d8C7");
	console.log("AnonymousvotingAddr is defined");

	// Local Crypto Contract
	var abi_crypto = [ { "constant": true, "inputs": [ { "name": "x", "type": "uint256" }, { "name": "yG", "type": "uint256[2]" }, { "name": "voteCrypted", "type": "uint256[2]" }, { "name": "totalVoter", "type": "uint256" }, { "name": "totalCandidat", "type": "uint256" } ], "name": "checkVote", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" }, { "name": "_result", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "res1D", "type": "uint256[5]" }, { "name": "res2D", "type": "uint256[2][2]" }, { "name": "diAndriList", "type": "uint256[2][]" } ], "name": "generateZKP", "outputs": [ { "name": "_y", "type": "uint256[3]" }, { "name": "_aList", "type": "uint256[2][10]" }, { "name": "_bList", "type": "uint256[2][10]" }, { "name": "_dAndrList", "type": "uint256[2][10]" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "yG", "type": "uint256[2]" }, { "name": "voteNull", "type": "uint256[2]" }, { "name": "r", "type": "uint256" }, { "name": "vG", "type": "uint256[3]" }, { "name": "vH", "type": "uint256[3]" } ], "name": "verifyZKPNullVote", "outputs": [ { "name": "_successful", "type": "bool", "value": false }, { "name": "_error", "type": "string", "value": "xG or vG or yiG or yivG isnt a PubKey" }, { "name": "temp_affine", "type": "uint256[2]", "value": [ "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "a", "type": "uint256" }, { "name": "b", "type": "uint256" } ], "name": "submod", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "res1D", "type": "uint256[2]" }, { "name": "y", "type": "uint256[3]" }, { "name": "res2D", "type": "uint256[2][2]" }, { "name": "diAndriList", "type": "uint256[2][]" }, { "name": "aList", "type": "uint256[2][10]" }, { "name": "bList", "type": "uint256[2][10]" } ], "name": "verifyZKPVote", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "yG", "type": "uint256[2]" }, { "name": "x", "type": "uint256" }, { "name": "choice", "type": "uint256" }, { "name": "totalVoters", "type": "uint256" } ], "name": "createVote", "outputs": [ { "name": "vote", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_m", "type": "uint256", "value": "0" }, { "name": "_vi", "type": "uint256", "value": "0" }, { "name": "_viG", "type": "uint256[3]", "value": [ "0", "0", "0" ] }, { "name": "_xyG", "type": "uint256[3]", "value": [ "0", "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "x", "type": "uint256" }, { "name": "v", "type": "uint256" }, { "name": "xG", "type": "uint256[2]" } ], "name": "createZKP", "outputs": [ { "name": "res", "type": "uint256[4]", "value": [ "0", "0", "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "x", "type": "uint256" }, { "name": "v", "type": "uint256" }, { "name": "yG", "type": "uint256[2]" } ], "name": "createZKPNullVote", "outputs": [ { "name": "res", "type": "uint256[7]", "value": [ "0", "0", "0", "0", "0", "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "yG", "type": "uint256[2]" }, { "name": "x", "type": "uint256" } ], "name": "createNullVote", "outputs": [ { "name": "res", "type": "uint256[2]", "value": [ "5.506626302227734366957871889516853432625060345377759417550018736038911672924e+76", "3.2670510020758816978083085130507043184471273380659243275938904335757337482424e+76" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "aPrivateKey", "type": "uint256" }, { "name": "bPublicKey", "type": "uint256[2]" } ], "name": "buildVotingPrivateKey", "outputs": [ { "name": "_privateKey", "type": "uint256", "value": "0" }, { "name": "_publicKey", "type": "uint256[2]", "value": [ "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "r", "type": "uint256" }, { "name": "vG", "type": "uint256[3]" } ], "name": "verifyZKP", "outputs": [ { "name": "_successful", "type": "bool", "value": false }, { "name": "_error", "type": "string", "value": "xG or vG isnt a PubKey" } ], "payable": false, "type": "function" }, { "inputs": [], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "x1", "type": "uint256" }, { "indexed": false, "name": "x2", "type": "uint256" } ], "name": "Debug", "type": "event" } ];
	var crypto_contract = web3.eth.contract(abi_crypto);
	cryptoAddr = crypto_contract.at("0x3eeBa4AdBeBCD4Cf4944506e773E866aec267096");
	console.log("CryptoAddr is defined");

	console.log("Init Helper.js ok")
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