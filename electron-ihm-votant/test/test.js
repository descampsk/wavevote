/**
 * http://usejsdoc.org/
 */

var Web3 = require('web3');
var BigNumber = require('bignumber.js');

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.99.100:8545"));
}

// Anonymous Voting Contract
var abi = [ { "constant": false, "inputs": [ { "name": "personalPublicKey", "type": "uint256[2]" }, { "name": "inscriptionCode", "type": "bytes32" } ], "name": "askForRegistration", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "addr", "type": "address" } ], "name": "sendOneEtherToVoter", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "computeTally", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "hasReceivedOneEther", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "addressid", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "point", "type": "uint256[2]" } ], "name": "discretLogarithme", "outputs": [ { "name": "_successful", "type": "bool", "value": false }, { "name": "_message", "type": "string", "value": "The point was null" }, { "name": "_result", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "getPeopleToRegister", "outputs": [ { "name": "_registrationAsked", "type": "bool", "value": false }, { "name": "_personalPublicKey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_inscriptionCode", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalRegistrationAsked", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "yG", "type": "uint256[2]" }, { "name": "voteNull", "type": "uint256[2]" }, { "name": "r", "type": "uint256" }, { "name": "vG", "type": "uint256[3]" }, { "name": "vH", "type": "uint256[3]" } ], "name": "verifyZKPNullVote", "outputs": [ { "name": "_successful", "type": "bool", "value": false }, { "name": "_error", "type": "string", "value": "xG or vG or yiG or yivG isnt a PubKey" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_question", "type": "string" }, { "name": "_answerListBytes", "type": "bytes32[]" }, { "name": "_finishSignupPhase", "type": "uint256" }, { "name": "_endSignupPhase", "type": "uint256" }, { "name": "_endVotingPhase", "type": "uint256" } ], "name": "beginSignUp", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "type": "function" }, { "constant": true, "inputs": [], "name": "endSignupPhase", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "finalTally", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "question", "outputs": [ { "name": "", "type": "string", "value": "No question set" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "peopleToRegisterMap", "outputs": [ { "name": "addr", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "registrationAsked", "type": "bool", "value": false }, { "name": "inscriptionCode", "type": "bytes32", "value": "0x0000000000000000000000000000000000000000000000000000000000000000" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "finishSignupPhase", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "vote", "type": "uint256[2]" } ], "name": "submitVote", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "addressToDoNullVote", "type": "address" }, { "name": "nullVote", "type": "uint256[2]" }, { "name": "vG", "type": "uint256[3]" }, { "name": "yvG", "type": "uint256[3]" }, { "name": "r", "type": "uint256" } ], "name": "submitNullVote", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "gap", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "getTotalAnswers", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "deadlinePassed", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalvoted", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "computeSumAllVote", "outputs": [ { "name": "_sum", "type": "uint256[2]", "value": [ "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "params", "type": "uint256[4]" }, { "name": "y", "type": "uint256[2]" }, { "name": "a1", "type": "uint256[2]" }, { "name": "b1", "type": "uint256[2]" }, { "name": "a2", "type": "uint256[2]" }, { "name": "b2", "type": "uint256[2]" } ], "name": "verify1outof2ZKP", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "hasAskedForRegistration", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "addEther", "outputs": [], "payable": true, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x7a4e839863f5862352efd06ab89af8ec72a9e7a5" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "accountToRegister", "type": "address" }, { "name": "adminPublicKey", "type": "uint256[2]" }, { "name": "xG", "type": "uint256[2]" }, { "name": "vG", "type": "uint256[3]" }, { "name": "r", "type": "uint256" } ], "name": "registerAccount", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": true, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "voterMapBis", "outputs": [ { "name": "addr", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "registered", "type": "bool", "value": false }, { "name": "voteCast", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "addressesToRegister", "outputs": [ { "name": "", "type": "address", "value": "0x" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "endVotingPhase", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalRecalculatedKey", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "hasCastVote", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "getVoterBis", "outputs": [ { "name": "_registered", "type": "bool", "value": false }, { "name": "_voteCast", "type": "bool", "value": false }, { "name": "_personalPublicKey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_adminPublicKey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_registeredkey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_reconstructedkey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_vote", "type": "uint256[2]", "value": [ "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "result", "type": "uint256" } ], "name": "manualComputeFinalTally", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "state", "outputs": [ { "name": "", "type": "uint8", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "isRegistered", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "answerList", "outputs": [ { "name": "", "type": "bytes32", "value": "0x" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "result", "type": "uint256" } ], "name": "computeFinalTally", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalregistered", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "forceCancelElection", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "addresses", "outputs": [ { "name": "", "type": "address", "value": "0x" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "inscriptionCodeUsed", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "r", "type": "uint256" }, { "name": "vG", "type": "uint256[3]" } ], "name": "verifyZKP", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "indexVoter", "type": "uint256" } ], "name": "computeReconstructedKey", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" }, { "name": "_yG", "type": "uint256[2]" } ], "payable": false, "type": "function" }, { "inputs": [ { "name": "_gap", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;gap", "template": "elements_input_uint", "value": "0" } ], "payable": true, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "addressVoter", "type": "address" }, { "indexed": false, "name": "_successful", "type": "bool" }, { "indexed": false, "name": "_error", "type": "string" }, { "indexed": false, "name": "_yG", "type": "uint256[2]" } ], "name": "ComputationReconstructedKeyEvent", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": false, "name": "_isVoteCast", "type": "bool" }, { "indexed": false, "name": "_error", "type": "string" } ], "name": "IsVoteCastEvent", "type": "event" } ];
var anonymousvoting = web3.eth.contract(abi);
var anonymousvotingAddr = anonymousvoting.at("0xab7c5b1cA8B812836814D6246c09a5CA5dfeaeC8");

// Local Crypto Contract
var abi_crypto = [ { "constant": true, "inputs": [ { "name": "x", "type": "uint256" }, { "name": "yG", "type": "uint256[2]" }, { "name": "voteCrypted", "type": "uint256[2]" }, { "name": "totalVoter", "type": "uint256" }, { "name": "totalCandidat", "type": "uint256" } ], "name": "checkVote", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" }, { "name": "_result", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "res1D", "type": "uint256[5]" }, { "name": "res2D", "type": "uint256[2][2]" }, { "name": "diAndriList", "type": "uint256[2][]" } ], "name": "generateZKP", "outputs": [ { "name": "_y", "type": "uint256[3]" }, { "name": "_aList", "type": "uint256[2][10]" }, { "name": "_bList", "type": "uint256[2][10]" }, { "name": "_dAndrList", "type": "uint256[2][10]" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "yG", "type": "uint256[2]" }, { "name": "voteNull", "type": "uint256[2]" }, { "name": "r", "type": "uint256" }, { "name": "vG", "type": "uint256[3]" }, { "name": "vH", "type": "uint256[3]" } ], "name": "verifyZKPNullVote", "outputs": [ { "name": "_successful", "type": "bool", "value": false }, { "name": "_error", "type": "string", "value": "xG or vG or yiG or yivG isnt a PubKey" }, { "name": "temp_affine", "type": "uint256[2]", "value": [ "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "a", "type": "uint256" }, { "name": "b", "type": "uint256" } ], "name": "submod", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "res1D", "type": "uint256[2]" }, { "name": "y", "type": "uint256[3]" }, { "name": "res2D", "type": "uint256[2][2]" }, { "name": "diAndriList", "type": "uint256[2][]" }, { "name": "aList", "type": "uint256[2][10]" }, { "name": "bList", "type": "uint256[2][10]" } ], "name": "verifyZKPVote", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_message", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "yG", "type": "uint256[2]" }, { "name": "x", "type": "uint256" }, { "name": "choice", "type": "uint256" }, { "name": "totalVoters", "type": "uint256" } ], "name": "createVote", "outputs": [ { "name": "vote", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_m", "type": "uint256", "value": "0" }, { "name": "_vi", "type": "uint256", "value": "0" }, { "name": "_viG", "type": "uint256[3]", "value": [ "0", "0", "0" ] }, { "name": "_xyG", "type": "uint256[3]", "value": [ "0", "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "x", "type": "uint256" }, { "name": "v", "type": "uint256" }, { "name": "xG", "type": "uint256[2]" } ], "name": "createZKP", "outputs": [ { "name": "res", "type": "uint256[4]", "value": [ "0", "0", "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "x", "type": "uint256" }, { "name": "v", "type": "uint256" }, { "name": "yG", "type": "uint256[2]" } ], "name": "createZKPNullVote", "outputs": [ { "name": "res", "type": "uint256[7]", "value": [ "0", "0", "0", "0", "0", "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "yG", "type": "uint256[2]" }, { "name": "x", "type": "uint256" } ], "name": "createNullVote", "outputs": [ { "name": "res", "type": "uint256[2]", "value": [ "5.506626302227734366957871889516853432625060345377759417550018736038911672924e+76", "3.2670510020758816978083085130507043184471273380659243275938904335757337482424e+76" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "aPrivateKey", "type": "uint256" }, { "name": "bPublicKey", "type": "uint256[2]" } ], "name": "buildVotingPrivateKey", "outputs": [ { "name": "_privateKey", "type": "uint256", "value": "0" }, { "name": "_publicKey", "type": "uint256[2]", "value": [ "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "r", "type": "uint256" }, { "name": "vG", "type": "uint256[3]" } ], "name": "verifyZKP", "outputs": [ { "name": "_successful", "type": "bool", "value": false }, { "name": "_error", "type": "string", "value": "xG or vG isnt a PubKey" } ], "payable": false, "type": "function" }, { "inputs": [], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "x1", "type": "uint256" }, { "indexed": false, "name": "x2", "type": "uint256" } ], "name": "Debug", "type": "event" } ];
var crypto_contract = web3.eth.contract(abi_crypto);
var cryptoAddr = crypto_contract.at("0x7c1CD59c29e2d7Ab395f727e6e4ef053FBF52917");

var assert = require('assert');


describe('LocalCrypto', function() {
	var x = new BigNumber("48658376369692987555031666767881717668775587174052909340662193457230006164074");
	var w = new BigNumber("17585645696760835057461780635689357015329603276176188888191057199116964642377");
	var vote = 1;
	var totalAnswers = 4;
	var totalVoters = 3;
	//var c = new BigNumber("100764357264123845028071622345478780976180436968776172877989770090258385758638");
	var res1D = [x,w,vote,totalAnswers,totalVoters];

	var xG = [new BigNumber("16557966788367920074802788622002308800854602652856993457959526013249107645496"), new BigNumber("31005194821177338199498665212227052307412008118342266058810536656858463118285")];
	var yG = [new BigNumber("1387414458788347559187517375406013159476240849439493312634275990638672015933"), new BigNumber("40671634200878528773750133802148281596684652026480884828389026374435740515541")];
	var res2D = [xG,yG];
	var d1r1 = [new BigNumber("75333395386044151831655615318814661461340541053228775612483892975449123387636"), new BigNumber("48807378218319216826713485822848114099638380638795084698370139655974290874169")];
	var d2r2 = [new BigNumber("8928340737692664569337569289722877717053066256757346270426580367142230704097"), new BigNumber("47914638386074268103729678392664164916242730915618079303055518424326830625941")];
	var d3r3 = [new BigNumber("101256342598977767814549612342020304720307978634226421873936399154954345898438"), new BigNumber("87021138892371146891276133814995010659874933767755739632905631450585278260617")];
	var diAndRiList = [d1r1,d2r2,d3r3];
	
	var result = cryptoAddr.generateZKP.call(res1D, res2D, diAndRiList);  
	
	
  describe('#testGenerateZKP()', function() {
    it('Checking the value of y', function() {
    	var y = result[0];
    	var y_x = new BigNumber("99418022442322948580273778695083213508053542947231696320808396297443782723982");
    	var y_y = new BigNumber("26188709501786759080012508167248411022809158722384215599890869405485995073991");
    	assert.equal(true, y_x.equals(y[0]));
    	assert.equal(true, y_y.equals(y[1]));
    });
    
    it('Checking the value of a0', function() {
    	var a = result[1][0];
    	var a_x_true = new BigNumber("110979658453974697090186876960632752578360934507718104864242169717911573754986");
    	var a_y_true = new BigNumber("101707922404051755352889215957098439754612808823257353857409502814690838891443");
    	assert.equal(true, a_x_true.equals(a[0]));
    	assert.equal(true, a_y_true.equals(a[1]));
    });
    
    it('Checking the value of a1', function() {
    	var a = result[1][1];
    	var a_x_true = new BigNumber("14167210643831834835975583443752398487200617351571356492188078128794062056782");
    	var a_y_true = new BigNumber("45490736958951441914289292181195746030439888298564785759439925369526592420623");
    	assert.equal(true, a_x_true.equals(a[0]));
    	assert.equal(true, a_y_true.equals(a[1]));
    });
    
    it('Checking the value of a2', function() {
    	var a = result[1][2];
    	var a_x_true = new BigNumber("60280558851023998221775551272247619281653972546957000004719386178596815465985");
    	var a_y_true = new BigNumber("39189337336786075927717493803786649587104400283637790816441605473998059642108");
    	assert.equal(true, a_x_true.equals(a[0]));
    	assert.equal(true, a_y_true.equals(a[1]));
    });
    
    it('Checking the value of a3', function() {
    	var a = result[1][3];
    	var a_x_true = new BigNumber("57762794527720159362408338721244399097911860111541263130824845990518564200142");
    	var a_y_true = new BigNumber("60472474757776699583119763606857083587041682675312042304346848931120556035265");
    	assert.equal(true, a_x_true.equals(a[0]));
    	assert.equal(true, a_y_true.equals(a[1]));
    });
    
    it('Checking the value of b0', function() {
    	var b = result[2][0];
    	var b_x_true = new BigNumber("82874637370423976223625349498439964186137360358402967486375110053879032011612");
    	var b_y_true = new BigNumber("115584299853699674635270892627905764964830375441152095156992180154328363661743");
    	assert.equal(true, b_x_true.equals(b[0]));
    	assert.equal(true, b_y_true.equals(b[1]));
    });
    
    it('Checking the value of b1', function() {
    	var b = result[2][1];
    	var b_x_true = new BigNumber("26783240809289169341296127414242322983693811308415175557720443725197137451414");
    	var b_y_true = new BigNumber("41094311271821987641757167707704114331048852900653505118554205483002478117354");
    	assert.equal(true, b_x_true.equals(b[0]));
    	assert.equal(true, b_y_true.equals(b[1]));
    });
    
    it('Checking the value of b2', function() {
    	var b = result[2][2];
    	var b_x_true = new BigNumber("65626051872360228245118281970490439105754290900159119539535964987177906417656");
    	var b_y_true = new BigNumber("52594753804929362228895743649100210033704876479379882259919925202071548845390");
    	assert.equal(true, b_x_true.equals(b[0]));
    	assert.equal(true, b_y_true.equals(b[1]));
    });
    
    it('Checking the value of b3', function() {
    	var b = result[2][3];
    	var b_x_true = new BigNumber("29662528448471617756863395192711144999188698930464954667096737027560359227862");
    	var b_y_true = new BigNumber("98057817802920995385025664589473646914311002664113172389829162443134559951183");
    	assert.equal(true, b_x_true.equals(b[0]));
    	assert.equal(true, b_y_true.equals(b[1]));
    });
    
    it('Checking the value of d0 and r0', function() {
    	var d0Andr0 = result[3][0];
    	var d0_true = new BigNumber("25214423960541840767332413029547279768510635083388793416987509395220948337049");
    	var r0_true = new BigNumber("114497724460133459141968688605007754372220505170639014488767894752990947313531");
    	assert.equal(true, d0_true.equals(d0Andr0[0]));
    	assert.equal(true, r0_true.equals(d0Andr0[1]));
    });
    
    it('Checking the value of d1 and r1', function() {
    	var dAndr = result[3][1];
    	var d_true = new BigNumber("75333395386044151831655615318814661461340541053228775612483892975449123387636");
    	var r_true = new BigNumber("48807378218319216826713485822848114099638380638795084698370139655974290874169");
    	assert.equal(true, d_true.equals(dAndr[0]));
    	assert.equal(true, r_true.equals(dAndr[1]));
    });
    
    it('Checking the value of d2 and r2', function() {
    	var dAndr = result[3][2];
    	var d_true = new BigNumber("8928340737692664569337569289722877717053066256757346270426580367142230704097");
    	var r_true = new BigNumber("47914638386074268103729678392664164916242730915618079303055518424326830625941");
    	assert.equal(true, d_true.equals(dAndr[0]));
    	assert.equal(true, r_true.equals(dAndr[1]));
    });
    
    it('Checking the value of d3 and r3', function() {
    	var dAndr = result[3][3];
    	var d_true = new BigNumber("101256342598977767814549612342020304720307978634226421873936399154954345898438");
    	var r_true = new BigNumber("87021138892371146891276133814995010659874933767755739632905631450585278260617");
    	assert.equal(true, d_true.equals(dAndr[0]));
    	assert.equal(true, r_true.equals(dAndr[1]));
    });
  });
  
  describe('#testVerifyZKPVote()', function() {
	  var res1D = [totalAnswers, totalVoters];
	  var aList = result[1];
	  var bList = result[2];
	  var y = result[0];
	  var dAndrList = result[3];
	  var resultVerif = cryptoAddr.verifyZKPVote.call(res1D, y, res2D, dAndrList, aList, bList);
	  
	    it('Result must be true', function() {
	    	assert.equal(true, resultVerif[0]);
	    });
	    
	   var y_bis = [new BigNumber("9739367694602739841270448824846646217481405539652545337798305097043169331479"), new BigNumber("33351534788122751310175489107583770866909071238170708043317598203433118443820"), 1];
	   var resultVerif2 = cryptoAddr.verifyZKPVote.call(res1D, y_bis, res2D, dAndrList, aList, bList);
	    it('Result must be false', function() {
	    	assert.equal(false, resultVerif2[0]);
	    });
  });
});

