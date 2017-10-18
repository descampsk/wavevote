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
var cryptoAddr = crypto_contract.at("0x3eeBa4AdBeBCD4Cf4944506e773E866aec267096");

var assert = require('assert');


describe('LocalCrypto', function() {
	var x = new BigNumber("7385512531010076278879072689338686085820576602980848378301760181592721586067");
	var w = new BigNumber("111060566025617807121589495984943382275682749328256914587867790025346698616272");
	var vote = 1;
	var totalAnswers = 4;
	var totalVoters = 3;
	var res1D = [x,w,vote,totalAnswers,totalVoters];

	var xG = [new BigNumber("71840711359209834681063588260988676288341246720055369795190651201227530549735"), new BigNumber("47268083912126831038559704109883466293336204891604209017513432801245564460187")];
	var yG = [new BigNumber("44858474007299553504772323166450432682717416914724923429917346295824087532924"), new BigNumber("108268263168942897488361650766749809744774041567294605581778083447260401449947")];
	var res2D = [xG,yG];
	var d0r0 = [new BigNumber("1991359654614872066524111230685500176074809674261498167022529070276941943683"), new BigNumber("56178836751149449258408021388836554421411005498284842488136021641236982230930")];
	var d2r2 = [new BigNumber("19551204037163832641518217771967113997308825689286148923250092268714294103432"), new BigNumber("63848130003035827334082267096085719250392226650360725840341308450754554031597")];
	var d3r3 = [new BigNumber("46165690955943305854386969806871616267709812304038744865715975612680907642326"), new BigNumber("38063982867308153895219542487673077404161040388720595614663552015246573987224")];
	var diAndRiList = [d0r0,d2r2,d3r3];
	
	var result = cryptoAddr.generateZKP.call(res1D, res2D, diAndRiList);  
	
	
  describe('#testGenerateZKP()', function() {
    it('Checking the value of y', function() {
    	var y = result[0];
    	var y_x = new BigNumber("80154103996133058363150805290570890836109994347991333384302968643420336531253");
    	var y_y = new BigNumber("56082266210691562908140871343618290190829570707165921519725872386571662438473");
    	assert.equal(true, y_x.equals(y[0]));
    	assert.equal(true, y_y.equals(y[1]));
    });
    
    it('Checking the value of a0', function() {
    	var a = result[1][0];
    	var a_x_true = new BigNumber("95448123513155019775058756832429896977617543404500026092262348665476625501134");
    	var a_y_true = new BigNumber("20862920563965941041350507452490241612458182744331949885302127952409552469913");
    	assert.equal(true, a_x_true.equals(a[0]));
    	assert.equal(true, a_y_true.equals(a[1]));
    });
    
    it('Checking the value of a1', function() {
    	var a = result[1][1];
    	var a_x_true = new BigNumber("11235346743500162081654423903098069626184520959733218892312313932593179665989");
    	var a_y_true = new BigNumber("62311000150049701354759845293593867798596953677711857258911268408609688232693");
    	assert.equal(true, a_x_true.equals(a[0]));
    	assert.equal(true, a_y_true.equals(a[1]));
    });
    
    it('Checking the value of a2', function() {
    	var a = result[1][2];
    	var a_x_true = new BigNumber("10307662713154891400972023619161718825223312178665996606667359677446722128377");
    	var a_y_true = new BigNumber("4632271272654014070803623577106771574640882917047289694563651289924772365009");
    	assert.equal(true, a_x_true.equals(a[0]));
    	assert.equal(true, a_y_true.equals(a[1]));
    });
    
    it('Checking the value of a3', function() {
    	var a = result[1][3];
    	var a_x_true = new BigNumber("54820324436823617150918055854366174776780222704830895270719593952393561446687");
    	var a_y_true = new BigNumber("60684326154945861619636417981427908743926235228598657903759495645068703795684");
    	assert.equal(true, a_x_true.equals(a[0]));
    	assert.equal(true, a_y_true.equals(a[1]));
    });
    
    it('Checking the value of b0', function() {
    	var b = result[2][0];
    	var b_x_true = new BigNumber("69973572383013078590587980215789917004366736855986928908219432907493986241108");
    	var b_y_true = new BigNumber("61272827973738759286830505557061452117470913762286878743058078995265869381851");
    	assert.equal(true, b_x_true.equals(b[0]));
    	assert.equal(true, b_y_true.equals(b[1]));
    });
    
    it('Checking the value of b1', function() {
    	var b = result[2][1];
    	var b_x_true = new BigNumber("23106663519691145849376407046816959585175758643675314747719703425208069354553");
    	var b_y_true = new BigNumber("63130380287586108286738558156632628833085725286332128767869777530249641100825");
    	assert.equal(true, b_x_true.equals(b[0]));
    	assert.equal(true, b_y_true.equals(b[1]));
    });
    
    it('Checking the value of b2', function() {
    	var b = result[2][2];
    	var b_x_true = new BigNumber("81873061170340726510044981574083583081008415942943534749552045553679085569344");
    	var b_y_true = new BigNumber("86705020865142387958391121272367090108879078696298981380487822968071230791301");
    	assert.equal(true, b_x_true.equals(b[0]));
    	assert.equal(true, b_y_true.equals(b[1]));
    });
    
    it('Checking the value of b3', function() {
    	var b = result[2][3];
    	var b_x_true = new BigNumber("103856391903032246820571416089795448201911819463233813521268474513705900812838");
    	var b_y_true = new BigNumber("49529156463371825103573735338153565814225299833236812205359338438402480358820");
    	assert.equal(true, b_x_true.equals(b[0]));
    	assert.equal(true, b_y_true.equals(b[1]));
    });
    
    it('Checking the value of d0 and r0', function() {
    	var d0Andr0 = result[3][0];
    	var d0_true = new BigNumber("1991359654614872066524111230685500176074809674261498167022529070276941943683");
    	var r0_true = new BigNumber("56178836751149449258408021388836554421411005498284842488136021641236982230930");
    	assert.equal(true, d0_true.equals(d0Andr0[0]));
    	assert.equal(true, r0_true.equals(d0Andr0[1]));
    });
    
    it('Checking the value of d1 and r1', function() {
    	var dAndr = result[3][1];
    	var d_true = new BigNumber("42557921195022767783508383153336589249861417153718145613257131896596211329551");
    	var r_true = new BigNumber("10624936769261530693234522125390363338536983132892343443646358725631064474791");
    	assert.equal(true, d_true.equals(dAndr[0]));
    	assert.equal(true, r_true.equals(dAndr[1]));
    });
    
    it('Checking the value of d2 and r2', function() {
    	var dAndr = result[3][2];
    	var d_true = new BigNumber("19551204037163832641518217771967113997308825689286148923250092268714294103432");
    	var r_true = new BigNumber("63848130003035827334082267096085719250392226650360725840341308450754554031597");
    	assert.equal(true, d_true.equals(dAndr[0]));
    	assert.equal(true, r_true.equals(dAndr[1]));
    });
    
    it('Checking the value of d3 and r3', function() {
    	var dAndr = result[3][3];
    	var d_true = new BigNumber("46165690955943305854386969806871616267709812304038744865715975612680907642326");
    	var r_true = new BigNumber("38063982867308153895219542487673077404161040388720595614663552015246573987224");
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

