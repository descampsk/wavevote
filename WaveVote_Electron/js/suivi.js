/**
 * http://usejsdoc.org/
 */

 //create a function which returns true or false to recognize a development environment
 const isProd = () => process.env.NODE_ENV === 'production';
 //use that function to either use the development path OR the production prefix to your file location
 const directory = isProd() ? 'resources/app' : './';

var BigNumber = require('bignumber.js');
var Web3 = require('web3');
var web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
  console.log("The current provider is defined.")
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.99.100:8545"));
  console.log("Http provider is defined : 192.168.99.100:8545");
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

const suiviJsonPath = require('path').join(directory, '/data/suivi.json');
const adminDatabasePath = require('path').join(directory, '/db/adminKey.db');
const suiviTransactionJsonPath = require('path').join(directory, '/data/suiviTransaction.json');
console.log("Set of the path : ok");

//Ouverture de la base de données
var Datastore = require('nedb')
var db = {};
db.adminKey = new Datastore({filename: adminDatabasePath, autoload: true, onload: function(error) {
	console.log(error);
}});

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: '10.120.3.25:9200',
  log: 'trace'
});

function updateAllVoters() {
	var bulk = [];
	var totalRegistrationAsked = anonymousvotingAddr.totalRegistrationAsked();
	for(var i=0;i<totalRegistrationAsked;i++) {
		var addressToRegister = anonymousvotingAddr.addressesToRegister(i);
		//addBulkUpdateSuiviAddress(bulk, addressToRegister);
		updateSuiviAddress(addressToRegister);
	}

	//Find all documents in the collection
	db.adminKey.find({}, function (err, docs) {
		for(var i=0;i<docs.length;i++) {
			var doc = docs[i];
			var address = doc.account;
			var numero = doc.numero
			if (address===undefined) {
		    	var voterJson = {
		    			name: doc.name, lastName: doc.lastName, mail: doc.mail, 
		    			registrationAsked: false, inscriptionCode: "confidentiel",
		    			inscriptionCodeValide: false,
		    			registered: false, voteCast: false,
		    		};
		    	
		    	var actionJson = { index : {
					  _index: 'transaction',
					  _type: 'voter',
					  _id: numero
		    		}	
				};
		    	
		    	bulk.push(actionJson);
		    	bulk.push(voterJson);
		    	/*
		    	var voterStr = JSON.stringify(voterJson);
				client.index({
					  index: 'transaction',
					  type: 'voter',
					  body: voterStr,
					  id: numero,
					}, function (error, response) {
					  console.log(error);
					  //console.log(response);
					});
					*/
			}
		}
		console.log(bulk);
		client.bulk({
			body: bulk
		}, function (err, resp) {
			console.log(err);
			console.log(resp);
		});
	});	
}

function insertAllBlocksAndTransactions() {
	const abiDecoder = require('abi-decoder');
	abiDecoder.addABI(abi);
	
	var lastBlockNumber = web3.eth.blockNumber;

	for(var i=1500;i<=lastBlockNumber;i++) {
		console.log(i);
		var block = web3.eth.getBlock(i,true);
		var transactionList = block.transactions;
		delete block["transactions"];
		delete block["logsBloom"];
		delete block["nonce"];
		var json = JSON.stringify(block);
		
		client.create({
			  index: 'transaction',
			  type: 'block',
			  body: json,
			  id: i,
			}, function (error, response) {
			  console.log(error);
			  console.log(response);
			});
		
		if(transactionList.length!=0) {
			for(var j=0;j<transactionList.length;j++) {
				var transaction = transactionList[j];
				var input = transaction.input;
				try{
					var inputDecoded = abiDecoder.decodeMethod(input);
					transaction.input = inputDecoded;
					json = JSON.stringify(transaction);
					client.create({
						  index: 'transaction',
						  type: 'transaction',
						  body: json,
						  id: i + "_" + j,
						}, function (error, response) {
						  console.log(error);
						  console.log(response);
						});
				} catch(e) {
					console.log(e);
				}
			}
		}
	}
}


function updateSuiviAddress(address) {
	var register = anonymousvotingAddr.getPeopleToRegister(address);
	//console.log("register : " + register);
	var registrationAsked = register[0];
	var personalPublicKey_x = register[1][0];
	var personalPublicKey_y = register[1][1];

	var inscriptionCode = web3.toUtf8(register[2]);
	
	
	db.adminKey.count({}, function (err, count) {
		db.adminKey.findOne({_id: inscriptionCode}, function(err, doc) {
	    	//console.log(doc);
	    	var inscriptionCodeValide;
	    	var name;
	    	var lastName;
	    	var mail;
	    	var adminPrivateKey;
	    	var votingPrivateKey;
	    	var numero;
	    	if(doc==null) {
	    		inscriptionCodeValide = false;
	    		name = "N/C";
	    		lasteName = "N/C";
	    		mail = "N/C";
	    		adminPrivateKey = "N/C";
	    		votingPrivateKey = "N/C";
	    		numero = count;
	    		count+=1;
	    	} else {
	    		inscriptionCodeValide = true;
	    		name = doc.name;
	    		lastName = doc.lastName;
	    		mail = doc.mail;
	    		adminPrivateKey = doc.adminPrivateKey;
	    		votingPrivateKey = doc.votingPrivateKey;
	    		numero = doc.numero;
	    	}
	    	
	    	var voter = anonymousvotingAddr.getVoterBis(address);
	    	var registered = voter[0];
	    	var voteCast = voter[1];
	    	var personalPublicKeyBis_x = voter[2][0];
	    	var personalPublicKeyBis_y = voter[2][1];
	    	//console.log(personalPublicKeyBis_x);
	    	//console.log(personalPublicKeyBis_y);
	    	//console.log(personalPublicKey_x);
	    	//console.log(personalPublicKey_y);
	    	var samePersonalKey;
	    	if (personalPublicKeyBis_x.equals(personalPublicKey_x) && personalPublicKeyBis_y.equals(personalPublicKey_y)) {
	    		samePersonalKey = true;
	    	} else {
	    		samePersonalKey = false;
	    	}
	    	
	    	var adminPublicKey_x = voter[3][0];
	    	var adminPublicKey_y = voter[3][1];
	    	
	    	var registeredKey_x = voter[4][0];
	    	var registeredKey_y = voter[4][1];
	    	
	    	var reconstructedKey_x = voter[5][0];
	    	var reconstructedKey_y = voter[5][1];
	    	
	    	var vote_x = voter[6][0];
	    	var vote_y = voter[6][1];
	    	
	    	var voterJson = {
	    			name: name, lastName: lastName, mail: mail, account: address, 
	    			registrationAsked: registrationAsked, inscriptionCode: inscriptionCode,
	    			inscriptionCodeValide: inscriptionCodeValide,
	    			registered: registered, voteCast: voteCast,
	    			samePersonalKey: samePersonalKey, 
	    			personalPublicKey: [personalPublicKey_x.toString(10), personalPublicKey_y.toString(10)],
	    			personalPublicKeyBis: [personalPublicKeyBis_x.toString(10), personalPublicKeyBis_y.toString(10)],
	    			adminPublicKey: [adminPublicKey_x.toString(10), adminPublicKey_y.toString(10)],
	    			registeredKey: [registeredKey_x.toString(10), registeredKey_y.toString(10)],
	    			reconstructedKey: [reconstructedKey_x.toString(10), reconstructedKey_y.toString(10)],
	    			vote: [vote_x.toString(10), vote_y.toString(10)]
	    		};
	    	
	    	var voterStr = JSON.stringify(voterJson);
			client.index({
				  index: 'transaction',
				  type: 'voter',
				  body: voterStr,
				  id: numero,
				}, function (error, response) {
				  console.log(error);
				  //console.log(response);
				});
		});
		
	});
}

function addBulkUpdateSuiviAddress(bulk, address) {
	var register = anonymousvotingAddr.getPeopleToRegister(address);
	//console.log("register : " + register);
	var registrationAsked = register[0];
	var personalPublicKey_x = register[1][0];
	var personalPublicKey_y = register[1][1];

	var inscriptionCode = web3.toUtf8(register[2]);
	
	
	db.adminKey.count({}, function (err, count) {
		db.adminKey.findOne({_id: inscriptionCode}, function(err, doc) {
	    	//console.log(doc);
	    	var inscriptionCodeValide;
	    	var name;
	    	var lastName;
	    	var mail;
	    	var adminPrivateKey;
	    	var votingPrivateKey;
	    	var numero;
	    	if(doc==null) {
	    		inscriptionCodeValide = false;
	    		name = "N/C";
	    		lasteName = "N/C";
	    		mail = "N/C";
	    		adminPrivateKey = "N/C";
	    		votingPrivateKey = "N/C";
	    		numero = count;
	    		count+=1;
	    	} else {
	    		inscriptionCodeValide = true;
	    		name = doc.name;
	    		lastName = doc.lastName;
	    		mail = doc.mail;
	    		adminPrivateKey = doc.adminPrivateKey;
	    		votingPrivateKey = doc.votingPrivateKey;
	    		numero = doc.numero;
	    	}
	    	
	    	var voter = anonymousvotingAddr.getVoterBis(address);
	    	var registered = voter[0];
	    	var voteCast = voter[1];
	    	var personalPublicKeyBis_x = voter[2][0];
	    	var personalPublicKeyBis_y = voter[2][1];
	    	//console.log(personalPublicKeyBis_x);
	    	//console.log(personalPublicKeyBis_y);
	    	//console.log(personalPublicKey_x);
	    	//console.log(personalPublicKey_y);
	    	var samePersonalKey;
	    	if (personalPublicKeyBis_x.equals(personalPublicKey_x) && personalPublicKeyBis_y.equals(personalPublicKey_y)) {
	    		samePersonalKey = true;
	    	} else {
	    		samePersonalKey = false;
	    	}
	    	
	    	var adminPublicKey_x = voter[3][0];
	    	var adminPublicKey_y = voter[3][1];
	    	
	    	var registeredKey_x = voter[4][0];
	    	var registeredKey_y = voter[4][1];
	    	
	    	var reconstructedKey_x = voter[5][0];
	    	var reconstructedKey_y = voter[5][1];
	    	
	    	var vote_x = voter[6][0];
	    	var vote_y = voter[6][1];
	    	
	    	var voterJson = {
	    			name: name, lastName: lastName, mail: mail, account: address, 
	    			registrationAsked: registrationAsked, inscriptionCode: inscriptionCode,
	    			inscriptionCodeValide: inscriptionCodeValide,
	    			registered: registered, voteCast: voteCast,
	    			samePersonalKey: samePersonalKey, 
	    			personalPublicKey: [personalPublicKey_x.toString(10), personalPublicKey_y.toString(10)],
	    			personalPublicKeyBis: [personalPublicKeyBis_x.toString(10), personalPublicKeyBis_y.toString(10)],
	    			adminPublicKey: [adminPublicKey_x.toString(10), adminPublicKey_y.toString(10)],
	    			registeredKey: [registeredKey_x.toString(10), registeredKey_y.toString(10)],
	    			reconstructedKey: [reconstructedKey_x.toString(10), reconstructedKey_y.toString(10)],
	    			vote: [vote_x.toString(10), vote_y.toString(10)]
	    		};
	    	
	    	//var voterStr = JSON.stringify(voterJson);
	    	var actionJson = { index : {
				  _index: 'transaction',
				  _type: 'voter',
				  _id: numero
	    		}	
			};
	    	
	    	bulk.push(actionJson);
	    	bulk.push(voterJson);
		});
		
	});
}
	
client.ping({
	  requestTimeout: 3000
	}, function (error) {
	  if (error) {
	    console.trace('elasticsearch cluster is down!');
	  } else {
	    console.log('All is well');
	    //insertAllBlocksAndTransactions();
	    updateAllVoters();
	  }
	});
