/**
 * http://usejsdoc.org/
 */
var Web3 = require('web3');
var web3;
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
  console.log("The current provider is defined.");
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.99.100:8545"));
  console.log("Http provider is defined : 192.168.99.100:8545");
}

var abiWaveVoteContractRegistry = [ { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "previousAbiList", "outputs": [ { "name": "", "type": "string", "value": "" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newBackend", "type": "address" }, { "name": "newAbi", "type": "string" } ], "name": "changeBackend", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "backendContract", "outputs": [ { "name": "", "type": "address", "value": "0x6362692668028225c799f19b53153fa82474d8c7" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "previousBackends", "outputs": [ { "name": "", "type": "address", "value": "0x0000000000000000000000000000000000000000" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "lastAbi", "outputs": [ { "name": "", "type": "string", "value": "[ { \"constant\": false, \"inputs\": [ { \"name\": \"personalPublicKey\", \"type\": \"uint256[2]\" }, { \"name\": \"inscriptionCode\", \"type\": \"bytes32\" } ], \"name\": \"askForRegistration\", \"outputs\": [ { \"name\": \"_successful\", \"type\": \"bool\" }, { \"name\": \"_error\", \"type\": \"string\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [ { \"name\": \"addr\", \"type\": \"address\" } ], \"name\": \"sendOneEtherToVoter\", \"outputs\": [ { \"name\": \"_successful\", \"type\": \"bool\" }, { \"name\": \"_error\", \"type\": \"string\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [], \"name\": \"computeTally\", \"outputs\": [ { \"name\": \"_successful\", \"type\": \"bool\" }, { \"name\": \"_message\", \"type\": \"string\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"\", \"type\": \"address\" } ], \"name\": \"hasReceivedOneEther\", \"outputs\": [ { \"name\": \"\", \"type\": \"bool\", \"value\": false } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"\", \"type\": \"address\" } ], \"name\": \"addressid\", \"outputs\": [ { \"name\": \"\", \"type\": \"uint256\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"point\", \"type\": \"uint256[2]\" } ], \"name\": \"discretLogarithme\", \"outputs\": [ { \"name\": \"_successful\", \"type\": \"bool\", \"value\": false }, { \"name\": \"_message\", \"type\": \"string\", \"value\": \"The point was null\" }, { \"name\": \"_result\", \"type\": \"uint256\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"_address\", \"type\": \"address\" } ], \"name\": \"getPeopleToRegister\", \"outputs\": [ { \"name\": \"_registrationAsked\", \"type\": \"bool\", \"value\": false }, { \"name\": \"_personalPublicKey\", \"type\": \"uint256[2]\", \"value\": [ \"0\", \"0\" ] }, { \"name\": \"_inscriptionCode\", \"type\": \"bytes32\", \"value\": \"0x0000000000000000000000000000000000000000000000000000000000000000\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"totalRegistrationAsked\", \"outputs\": [ { \"name\": \"\", \"type\": \"uint256\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"xG\", \"type\": \"uint256[2]\" }, { \"name\": \"yG\", \"type\": \"uint256[2]\" }, { \"name\": \"voteNull\", \"type\": \"uint256[2]\" }, { \"name\": \"r\", \"type\": \"uint256\" }, { \"name\": \"vG\", \"type\": \"uint256[3]\" }, { \"name\": \"vH\", \"type\": \"uint256[3]\" } ], \"name\": \"verifyZKPNullVote\", \"outputs\": [ { \"name\": \"_successful\", \"type\": \"bool\", \"value\": false }, { \"name\": \"_error\", \"type\": \"string\", \"value\": \"xG or vG or yiG or yivG isnt a PubKey\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [ { \"name\": \"_question\", \"type\": \"string\" }, { \"name\": \"_answerListBytes\", \"type\": \"bytes32[]\" }, { \"name\": \"_finishSignupPhase\", \"type\": \"uint256\" }, { \"name\": \"_endSignupPhase\", \"type\": \"uint256\" }, { \"name\": \"_endVotingPhase\", \"type\": \"uint256\" } ], \"name\": \"beginSignUp\", \"outputs\": [ { \"name\": \"\", \"type\": \"bool\" } ], \"payable\": true, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"endSignupPhase\", \"outputs\": [ { \"name\": \"\", \"type\": \"uint256\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"\", \"type\": \"uint256\" } ], \"name\": \"finalTally\", \"outputs\": [ { \"name\": \"\", \"type\": \"uint256\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"question\", \"outputs\": [ { \"name\": \"\", \"type\": \"string\", \"value\": \"No question set\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"\", \"type\": \"address\" } ], \"name\": \"peopleToRegisterMap\", \"outputs\": [ { \"name\": \"addr\", \"type\": \"address\", \"value\": \"0x0000000000000000000000000000000000000000\" }, { \"name\": \"registrationAsked\", \"type\": \"bool\", \"value\": false }, { \"name\": \"inscriptionCode\", \"type\": \"bytes32\", \"value\": \"0x0000000000000000000000000000000000000000000000000000000000000000\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"finishSignupPhase\", \"outputs\": [ { \"name\": \"\", \"type\": \"uint256\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [ { \"name\": \"addressToDoNullVote\", \"type\": \"address\" }, { \"name\": \"nullVote\", \"type\": \"uint256[2]\" }, { \"name\": \"vG\", \"type\": \"uint256[3]\" }, { \"name\": \"yvG\", \"type\": \"uint256[3]\" }, { \"name\": \"r\", \"type\": \"uint256\" } ], \"name\": \"submitNullVote\", \"outputs\": [ { \"name\": \"_successful\", \"type\": \"bool\" }, { \"name\": \"_error\", \"type\": \"string\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"gap\", \"outputs\": [ { \"name\": \"\", \"type\": \"uint256\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"getTotalAnswers\", \"outputs\": [ { \"name\": \"\", \"type\": \"uint256\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [ { \"name\": \"y\", \"type\": \"uint256[3]\" }, { \"name\": \"diAndriList\", \"type\": \"uint256[2][10]\" }, { \"name\": \"aList\", \"type\": \"uint256[2][10]\" }, { \"name\": \"bList\", \"type\": \"uint256[2][10]\" } ], \"name\": \"submitVote\", \"outputs\": [ { \"name\": \"_successful\", \"type\": \"bool\" }, { \"name\": \"_message\", \"type\": \"string\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [], \"name\": \"deadlinePassed\", \"outputs\": [ { \"name\": \"\", \"type\": \"bool\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"totalvoted\", \"outputs\": [ { \"name\": \"\", \"type\": \"uint256\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"computeSumAllVote\", \"outputs\": [ { \"name\": \"_sum\", \"type\": \"uint256[2]\", \"value\": [ \"0\", \"0\" ] } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"_address\", \"type\": \"address\" } ], \"name\": \"hasAskedForRegistration\", \"outputs\": [ { \"name\": \"\", \"type\": \"bool\", \"value\": false } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [], \"name\": \"addEther\", \"outputs\": [], \"payable\": true, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"owner\", \"outputs\": [ { \"name\": \"\", \"type\": \"address\", \"value\": \"0x7a4e839863f5862352efd06ab89af8ec72a9e7a5\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [ { \"name\": \"accountToRegister\", \"type\": \"address\" }, { \"name\": \"adminPublicKey\", \"type\": \"uint256[2]\" }, { \"name\": \"xG\", \"type\": \"uint256[2]\" }, { \"name\": \"vG\", \"type\": \"uint256[3]\" }, { \"name\": \"r\", \"type\": \"uint256\" } ], \"name\": \"registerAccount\", \"outputs\": [ { \"name\": \"_successful\", \"type\": \"bool\" }, { \"name\": \"_error\", \"type\": \"string\" } ], \"payable\": true, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"\", \"type\": \"uint256\" } ], \"name\": \"voterMapBis\", \"outputs\": [ { \"name\": \"addr\", \"type\": \"address\", \"value\": \"0x0000000000000000000000000000000000000000\" }, { \"name\": \"registered\", \"type\": \"bool\", \"value\": false }, { \"name\": \"voteCast\", \"type\": \"bool\", \"value\": false } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"\", \"type\": \"uint256\" } ], \"name\": \"addressesToRegister\", \"outputs\": [ { \"name\": \"\", \"type\": \"address\", \"value\": \"0x\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"endVotingPhase\", \"outputs\": [ { \"name\": \"\", \"type\": \"uint256\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"totalRecalculatedKey\", \"outputs\": [ { \"name\": \"\", \"type\": \"uint256\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"_address\", \"type\": \"address\" } ], \"name\": \"hasCastVote\", \"outputs\": [ { \"name\": \"\", \"type\": \"bool\", \"value\": false } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"_address\", \"type\": \"address\" } ], \"name\": \"getVoterBis\", \"outputs\": [ { \"name\": \"_registered\", \"type\": \"bool\", \"value\": false }, { \"name\": \"_voteCast\", \"type\": \"bool\", \"value\": false }, { \"name\": \"_personalPublicKey\", \"type\": \"uint256[2]\", \"value\": [ \"0\", \"0\" ] }, { \"name\": \"_adminPublicKey\", \"type\": \"uint256[2]\", \"value\": [ \"0\", \"0\" ] }, { \"name\": \"_registeredkey\", \"type\": \"uint256[2]\", \"value\": [ \"0\", \"0\" ] }, { \"name\": \"_reconstructedkey\", \"type\": \"uint256[2]\", \"value\": [ \"0\", \"0\" ] }, { \"name\": \"_vote\", \"type\": \"uint256[2]\", \"value\": [ \"0\", \"0\" ] } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [ { \"name\": \"result\", \"type\": \"uint256\" } ], \"name\": \"manualComputeFinalTally\", \"outputs\": [ { \"name\": \"_successful\", \"type\": \"bool\" }, { \"name\": \"_message\", \"type\": \"string\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"state\", \"outputs\": [ { \"name\": \"\", \"type\": \"uint8\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"_address\", \"type\": \"address\" } ], \"name\": \"isRegistered\", \"outputs\": [ { \"name\": \"\", \"type\": \"bool\", \"value\": false } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"\", \"type\": \"uint256\" } ], \"name\": \"answerList\", \"outputs\": [ { \"name\": \"\", \"type\": \"bytes32\", \"value\": \"0x\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [ { \"name\": \"result\", \"type\": \"uint256\" } ], \"name\": \"computeFinalTally\", \"outputs\": [ { \"name\": \"_successful\", \"type\": \"bool\" }, { \"name\": \"_message\", \"type\": \"string\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [], \"name\": \"totalregistered\", \"outputs\": [ { \"name\": \"\", \"type\": \"uint256\", \"value\": \"0\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [], \"name\": \"forceCancelElection\", \"outputs\": [], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [ { \"name\": \"y\", \"type\": \"uint256[3]\" }, { \"name\": \"res2D\", \"type\": \"uint256[2][2]\" }, { \"name\": \"diAndriList\", \"type\": \"uint256[2][10]\" }, { \"name\": \"aList\", \"type\": \"uint256[2][10]\" }, { \"name\": \"bList\", \"type\": \"uint256[2][10]\" } ], \"name\": \"verifyZKPVote\", \"outputs\": [ { \"name\": \"_successful\", \"type\": \"bool\" }, { \"name\": \"_message\", \"type\": \"string\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"\", \"type\": \"uint256\" } ], \"name\": \"addresses\", \"outputs\": [ { \"name\": \"\", \"type\": \"address\", \"value\": \"0x\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": true, \"inputs\": [ { \"name\": \"\", \"type\": \"bytes32\" } ], \"name\": \"inscriptionCodeUsed\", \"outputs\": [ { \"name\": \"\", \"type\": \"bool\", \"value\": false } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [ { \"name\": \"newOwner\", \"type\": \"address\" } ], \"name\": \"transferOwnership\", \"outputs\": [], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [ { \"name\": \"xG\", \"type\": \"uint256[2]\" }, { \"name\": \"r\", \"type\": \"uint256\" }, { \"name\": \"vG\", \"type\": \"uint256[3]\" } ], \"name\": \"verifyZKP\", \"outputs\": [ { \"name\": \"\", \"type\": \"bool\" } ], \"payable\": false, \"type\": \"function\" }, { \"constant\": false, \"inputs\": [ { \"name\": \"indexVoter\", \"type\": \"uint256\" } ], \"name\": \"computeReconstructedKey\", \"outputs\": [ { \"name\": \"_successful\", \"type\": \"bool\" }, { \"name\": \"_message\", \"type\": \"string\" }, { \"name\": \"_yG\", \"type\": \"uint256[2]\" } ], \"payable\": false, \"type\": \"function\" }, { \"inputs\": [ { \"name\": \"_gap\", \"type\": \"uint256\", \"index\": 0, \"typeShort\": \"uint\", \"bits\": \"256\", \"displayName\": \"&thinsp;<span class=\\\"punctuation\\\">_</span>&thinsp;gap\", \"template\": \"elements_input_uint\", \"value\": \"\" } ], \"payable\": true, \"type\": \"constructor\" }, { \"anonymous\": false, \"inputs\": [ { \"indexed\": true, \"name\": \"addressVoter\", \"type\": \"address\" }, { \"indexed\": false, \"name\": \"_successful\", \"type\": \"bool\" }, { \"indexed\": false, \"name\": \"_error\", \"type\": \"string\" }, { \"indexed\": false, \"name\": \"_yG\", \"type\": \"uint256[2]\" } ], \"name\": \"ComputationReconstructedKeyEvent\", \"type\": \"event\" }, { \"anonymous\": false, \"inputs\": [ { \"indexed\": true, \"name\": \"_from\", \"type\": \"address\" }, { \"indexed\": false, \"name\": \"_isVoteCast\", \"type\": \"bool\" }, { \"indexed\": false, \"name\": \"_error\", \"type\": \"string\" } ], \"name\": \"IsVoteCastEvent\", \"type\": \"event\" } ]" } ], "payable": false, "type": "function" }, { "inputs": [], "payable": false, "type": "constructor" } ];
var WaveVoteContractRegistry = web3.eth.contract(abiWaveVoteContractRegistry);
var WaveVoteContractRegistryAddr = WaveVoteContractRegistry.at("0x56800c550c8B63dE33734370E081151aBe9cFb33");

//Anonymous Voting Contract
var abiWaveVote = WaveVoteContractRegistryAddr.lastAbi();
var anonymousvoting = web3.eth.contract(abiWaveVote);

var abiDecoder = require('abi-decoder');
abiDecoder.addABI(abiWaveVote);

var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: '10.120.3.25:9200',
  log: 'trace'
});

function updateElastic() {
	var filter = web3.eth.filter('latest');
 
	filter.watch(function (error, log) {
		console.log(web3.eth.getBlock(log));
		console.log(log);
		var block = web3.eth.getBlock(log,true);
		var transactionList = block.transactions;
		delete block.transactions;
		delete block.logsBloom;
		delete block.nonce;
		
		var json = JSON.stringify(block);
		
		client.create({
			  index: 'transaction',
			  type: 'block',
			  id: block.number,
			  body: json
			}, function (error, response) {
			  console.log(error);
			  console.log(response);
			});
		
		
		if(transactionList.length!==0) {
			for(var j=0;j<transactionList.length;j++) {
				var transaction = transactionList[j];
				var input = transaction.input;
				try{
					var inputDecoded = abiDecoder.decodeMethod(input);
					transaction.input = inputDecoded;
					var jsonTransaction = JSON.stringify(transaction);
					var id = block.number + j;
					client.create({
						  index: 'transaction',
						  type: 'transaction',
						  body: jsonTransaction,
						  id: block.number + "_" + j,
						}, function (error, response) {
						  console.log(error);
						  console.log(response);
						});
				} catch(e) {
					console.log(e);
				}
			}
		}
	});
}

client.ping({
	  requestTimeout: 3000
	}, function (error) {
	  if (error) {
	    console.trace('elasticsearch cluster is down!');
	  } else {
	    console.log('All is well');
	    updateElastic();
	  }
	});