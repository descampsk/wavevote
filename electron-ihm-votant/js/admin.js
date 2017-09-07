var jre = require('node-jre');

//Loging
 var winston = require('winston');
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
 winston.info("Hello");
 
 
//create a function which returns true or false to recognize a development environment
 const isProd = () => process.env.NODE_ENV === 'production';
 console.log(isProd());
 console.log(process.env);
 //use that function to either use the development path OR the production prefix to your file location
 const directory = isProd() ? 'resources/app' : './';
 console.log(directory);
 
 //This requires an environment variable, which we will get to in a moment.
 //require files joining that directory variable with the location within your package of files
 const databasePath = require('path').join(directory, '/db/adminKey.db');
 const javaPath = require('path').join(directory, '/java/');
 console.log(databasePath);
 
var web3;
var password = "";
var addressChosen = false;
var addr = 0;
var state = 0;
var accountindex = 0;

var $ = require('jQuery')
var Web3 = require('web3');
var BigNumber = require('bignumber.js');

var paramUrl = location.search.substring(1);
var addr = paramUrl.split('=')[1];
document.getElementById('pageAdmin').href="admin.html?addr=" + addr;
document.getElementById('pageVotant').href="vote.html?addr=" + addr;

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://" + addr));
}

// Anonymous Voting Contract
var abi = [ { "constant": false, "inputs": [ { "name": "addr", "type": "address" } ], "name": "sendOneEtherToVoter", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "computeTally", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "hasReceivedOneEther", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "addressid", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "getPeopleToRegister", "outputs": [ { "name": "_registrationAsked", "type": "bool", "value": false }, { "name": "_personalPublicKey", "type": "uint256[2]", "value": [ "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalRegistrationAsked", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "endSignupPhase", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "r", "type": "uint256" }, { "name": "vG", "type": "uint256[3]" }, { "name": "baseZKP", "type": "uint256[2]" } ], "name": "verifyZKP", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "question", "outputs": [ { "name": "", "type": "string", "value": "No question set" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "peopleToRegisterMap", "outputs": [ { "name": "addr", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "registrationAsked", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "finishSignupPhase", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "personalPublicKey", "type": "uint256[2]" } ], "name": "askForRegistration", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "finishRegistrationPhase", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "params", "type": "uint256[4]" }, { "name": "y", "type": "uint256[2]" }, { "name": "a1", "type": "uint256[2]" }, { "name": "b1", "type": "uint256[2]" }, { "name": "a2", "type": "uint256[2]" }, { "name": "b2", "type": "uint256[2]" } ], "name": "submitVote", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "gap", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "deadlinePassed", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalvoted", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "params", "type": "uint256[4]" }, { "name": "y", "type": "uint256[2]" }, { "name": "a1", "type": "uint256[2]" }, { "name": "b1", "type": "uint256[2]" }, { "name": "a2", "type": "uint256[2]" }, { "name": "b2", "type": "uint256[2]" } ], "name": "verify1outof2ZKP", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "hasAskedForRegistration", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "addEther", "outputs": [], "payable": true, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x7a4e839863f5862352efd06ab89af8ec72a9e7a5" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "accountToRegister", "type": "address" }, { "name": "adminPublicKey", "type": "uint256[2]" }, { "name": "xG", "type": "uint256[2]" }, { "name": "vG", "type": "uint256[3]" }, { "name": "r", "type": "uint256" } ], "name": "registerAccount", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": true, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "voterMapBis", "outputs": [ { "name": "addr", "type": "address", "value": "0x0000000000000000000000000000000000000000" }, { "name": "registered", "type": "bool", "value": false }, { "name": "voteCast", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "addressesToRegister", "outputs": [ { "name": "", "type": "address", "value": "0x" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "endVotingPhase", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "hasCastVote", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "getVoterBis", "outputs": [ { "name": "_registered", "type": "bool", "value": false }, { "name": "_voteCast", "type": "bool", "value": false }, { "name": "_personalPublicKey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_adminPublicKey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_registeredkey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_reconstructedkey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_vote", "type": "uint256[2]", "value": [ "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "state", "outputs": [ { "name": "", "type": "uint8", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "isRegistered", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "finaltally", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "addressToDoNullVote", "type": "address" }, { "name": "nullVote", "type": "uint256[2]" }, { "name": "reconstructedKey", "type": "uint256[2]" }, { "name": "vG", "type": "uint256[3]" }, { "name": "r", "type": "uint256" } ], "name": "submitNullVote", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalregistered", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_question", "type": "string" }, { "name": "_finishSignupPhase", "type": "uint256" }, { "name": "_endSignupPhase", "type": "uint256" }, { "name": "_endVotingPhase", "type": "uint256" } ], "name": "beginSignUp", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "type": "function" }, { "constant": false, "inputs": [], "name": "forceCancelElection", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "addresses", "outputs": [ { "name": "", "type": "address", "value": "0x" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "type": "function" }, { "inputs": [ { "name": "_gap", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;gap", "template": "elements_input_uint", "value": "0" } ], "payable": true, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": false, "name": "_isVoteCast", "type": "bool" }, { "indexed": false, "name": "_error", "type": "string" } ], "name": "IsVoteCastEvent", "type": "event" } ];
var anonymousvoting = web3.eth.contract(abi);
var anonymousvotingAddr = anonymousvoting.at("0x1d9b258cBb7A8791AE2628DD86cE4CAdA551d22C");

// Local Crypto Contract
var abi_crypto = [ { "constant": false, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "yG", "type": "uint256[2]" }, { "name": "w", "type": "uint256" }, { "name": "r2", "type": "uint256" }, { "name": "d2", "type": "uint256" }, { "name": "x", "type": "uint256" } ], "name": "create1outof2ZKPNoVote", "outputs": [ { "name": "res", "type": "uint256[10]" }, { "name": "res2", "type": "uint256[4]" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "r", "type": "uint256" }, { "name": "vG", "type": "uint256[3]" }, { "name": "baseZKP", "type": "uint256[2]" } ], "name": "verifyZKP", "outputs": [ { "name": "_successful", "type": "bool", "value": false }, { "name": "_error", "type": "string", "value": "xG or vG isnt a PubKey" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "a", "type": "uint256" }, { "name": "b", "type": "uint256" } ], "name": "submod", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "yG", "type": "uint256[2]" }, { "name": "x", "type": "uint256" } ], "name": "createNullVote", "outputs": [ { "name": "res", "type": "uint256[2]", "value": [ "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "x", "type": "uint256" }, { "name": "_yG", "type": "uint256[2]" }, { "name": "_voteCrypted", "type": "uint256[2]" } ], "name": "checkVote", "outputs": [ { "name": "temp1_bis", "type": "uint256[3]", "value": [ "0", "0", "0" ] }, { "name": "temp2_bis", "type": "uint256[3]", "value": [ "0", "0", "0" ] }, { "name": "temp4", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "params", "type": "uint256[4]" }, { "name": "xG", "type": "uint256[2]" }, { "name": "yG", "type": "uint256[2]" }, { "name": "y", "type": "uint256[2]" }, { "name": "a1", "type": "uint256[2]" }, { "name": "b1", "type": "uint256[2]" }, { "name": "a2", "type": "uint256[2]" }, { "name": "b2", "type": "uint256[2]" } ], "name": "verify1outof2ZKP", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "yG", "type": "uint256[2]" }, { "name": "w", "type": "uint256" }, { "name": "r1", "type": "uint256" }, { "name": "d1", "type": "uint256" }, { "name": "x", "type": "uint256" } ], "name": "create1outof2ZKPYesVote", "outputs": [ { "name": "res", "type": "uint256[10]" }, { "name": "res2", "type": "uint256[4]" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "x", "type": "uint256" }, { "name": "v", "type": "uint256" }, { "name": "xG", "type": "uint256[2]" }, { "name": "baseZKP", "type": "uint256[2]" } ], "name": "createZKP", "outputs": [ { "name": "res", "type": "uint256[4]", "value": [ "0", "0", "0", "0" ] } ], "payable": false, "type": "function" }, { "inputs": [], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "x1", "type": "uint256" }, { "indexed": false, "name": "x2", "type": "uint256" } ], "name": "Debug", "type": "event" } ];
var crypto_contract = web3.eth.contract(abi_crypto);
var cryptoAddr = crypto_contract.at("0xd7944d681D277B9ce36802364Fca01D6d8757831");

//Ouverture de la base de données
var Datastore = require('nedb')
var db = new Datastore({filename: databasePath, autoload: true});

//Create and initialize EC context 
//(better do it once and reuse it) 
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');

// Controls which times and dates are displayed by default
// We need to ensure there is a 'minimum' gap between default times too.
// TODO: When the 'gap' drop down box is used... update all times accordingly.
function setInitialTimes() {

   var endreg = new Date();
   var endsignuptime = new Date();
   var gap = anonymousvotingAddr.gap();

   endreg.setTime(endreg.getTime() + (gap*1000));
   // Initial time is set here.
   jQuery('#datetimepickerfinishby').datetimepicker(
     {minDate:'0', // Sets minimum date as today
      value:endreg});

   endsignuptime.setTime(endreg.getTime() + (gap*1000));
   jQuery('#datetimepickerendsignup').datetimepicker(
     {minDate:'0', // Sets minimum date as today
      value:endsignuptime});

   var endvotetime = new Date();
   endvotetime.setTime(endreg.getTime() + (gap*1000));
   jQuery('#datetimepickerendvote').datetimepicker(
     {minDate:'0', // Sets minimum date as today
     value:endvotetime});

   var endrefund = new Date();
   endrefund.setTime(endvotetime.getTime() + (gap*1000));
   jQuery('#datetimepickerendrefund').datetimepicker(
     {minDate:'0', // Sets minimum date as today
     value:endrefund});


   $.datetimepicker.setLocale('en');

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


function cancelElection() {
  web3.personal.unlockAccount(addr, password);
  var res = anonymousvotingAddr.deadlinePassed.call({ from: web3.eth.accounts[accountindex], gas: 4200000});

  if(res) {
    anonymousvotingAddr.forceCancelElection.sendTransaction({from: web3.eth.accounts[accountindex],gas: 4200000});
    document.getElementById("cancelelectionbutton").setAttribute("disabled",true);
    alert("Please wait a few minutes for the election to be cancelled.");
  } else {
	  alert("Deadlines aren't passed : you can't cancel the election");
  }

  return false;
}

function resetElection() {

  var currentTime = new Date();

  web3.personal.unlockAccount(addr, password);
  var res = anonymousvotingAddr.deadlinePassed.call({ from: web3.eth.accounts[accountindex], gas: 4200000});

  if(res) {
    anonymousvotingAddr.forceCancelElection.sendTransaction({from: web3.eth.accounts[accountindex],gas: 4200000});
    document.getElementById('tallydiv').innerHTML = "Please refresh your web browser in a few minutes";
  } else {
	  //TODO : faire un message d'erreur
	  alert("Erreur !")
  }

  return false;
}


// Check that the user is eligible to vote
function setEligible() {
  var tempaddr;

  if(addressChosen) {

    var lastchar = document.getElementById('addresses').value.trim().slice(-1);
    var toSplit;

    // Make sure the user has not ended the list with ','
    if(lastchar == ',') {
      var len = document.getElementById('addresses').value.length;
      toSplit = document.getElementById('addresses').value.substring(0,len-1);

    } else {
      toSplit = document.getElementById('addresses').value;
    }

    var split = toSplit.split(",");

    // TODO: Sanity check the list ... verify they are all valid Ethereum addresses
    var addresses = new Array();

    // TODO: Check with Ethereum how many addresses have ALREADY been accepted.
    // It will only hold UP to 40. No point sending 40 if Ethereum already has 25. (We should send 15 in that case).
    var uptolimit;

    if(split.length > 40) {
      if(!confirm("We can only use the first 40 addresses... Is this ok?")) {
        return;
      }
      uptolimit = 40;
    } else {
      uptolimit = split.length;
    }

    // No point re-submiting an address if it is already eligible
    for(var i=0; i<uptolimit; i++) {
      if(!anonymousvotingAddr.eligible(split[i])) {
        addresses.push(split[i]);
      }
    }

    // Do we have any addresses that are not yet eligible?
    if(addresses.length > 0) {
      web3.personal.unlockAccount(addr,password)
      var res = anonymousvotingAddr.setEligible.sendTransaction(addresses, {from:web3.eth.accounts[accountindex], gas: 4200000})

      txlist("Set Eligible: " + res);

      alert("Sent " + addresses.length + " addresses to Ethereum whitelist");
    } else {
      alert("All addresses are already eligible!");
    }

  } else {
    alert("You need to select the admin address first!");
  }
}

// Allow people to start submiting their voting key.
function beginRegistration() {

  if(!addressChosen) {
    alert("Please unlock your Ethereum address.");
    return;
  }

  if(state != 0) {
    alert("Please wait until SETUP Phase");
    return;
  }

  // Sanity check all the timer values given to us
  var finishby_val = $('#datetimepickerfinishby').datetimepicker('getValue');
  if(finishby_val == null) {
    alert("Please select the finish time for the Registration phase");
    return;
  }

  var endsignup_val = $('#datetimepickerendsignup').datetimepicker('getValue');

  if(endsignup_val == null) {
    alert("Please select which time the Registration phase MUST end");
    return;
  }

  var endvote_val = $('#datetimepickerendvote').datetimepicker('getValue');

  if(endvote_val == null) {
    alert("Please select which time the Computation phase MUST end");
    return;
  }

  var finishby = Math.floor(finishby_val.getTime()/1000); // Ethereum works in seconds, not milliseconds.
  var endsignup = Math.floor(endsignup_val.getTime()/1000); // Ethereum works in seconds, not milliseconds.
  var endvote = Math.floor(endvote_val.getTime()/1000); // Ethereum works in seconds, not milliseconds.
  var question = document.getElementById('questioninput').value;

  if(anonymousvotingAddr.beginSignUp.call(question, finishby, endsignup, endvote, {from:web3.eth.accounts[accountindex], value: 0 })) {
     var res = anonymousvotingAddr.beginSignUp.sendTransaction(question, finishby, endsignup, endvote, {from:web3.eth.accounts[accountindex], gas: 4200000, value: 0 });
     destorypickers();
     
     //Delete the database
     db.remove({}, { multi: true }, function (err, numRemoved) {
     });
     
     document.getElementById("beginRegistrationbutton").innerHTML  = "Waiting for Ethereum to confirm that Registration has started";
     txlist("Begin Registration Phase: " + res);
  } else {
     // TODO: Better error message, and perhaps JS to enforce minimum gap etc.
     alert("Ethereum will not accept those dates and times.");
  }
}

function destorypickers() {
    $('#datetimepickerfinishby').datetimepicker('destroy');
    $('#datetimepickerendsignup').datetimepicker('destroy');
    $('#datetimepickerendvote').datetimepicker('destroy');
}
// Allow the Election Authority to finish the registration phase...
function finishRegistration() {
  if(!addressChosen) {
    alert("Please unlock your Ethereum address");
    return;
  }

  if(state != 1) {
    alert("Please wait until Registration Phase");
    return;
  }

  if(anonymousvotingAddr.totalregistered() < 3) {
    alert("Election cannot begin until there is 3 or more registered voters");
    return;
  }

  var time = new Date();
  var finishReg = anonymousvotingAddr.finishSignupPhase() * 1000;
  
  var reg = anonymousvotingAddr.totalregistered();
  
  //TODO retirer le false : DEBUG ONLY
  if(time.getTime() < finishReg && false) {
    alert("Please wait until " + clockformat(new Date(finishReg)) + " before finishing registration or that all eligible voters have vote.");
    return;
  }
  

  web3.personal.unlockAccount(addr,password);

  var res = anonymousvotingAddr.finishRegistrationPhase.sendTransaction({from:web3.eth.accounts[accountindex], gas: 4200000});
  document.getElementById("finishRegistration").innerHTML  = "Waiting for Ethereum to confirm that Registration has finished";

  txlist("Finish Registration Phase: " + res);
}

var isVoteCastEvent = anonymousvotingAddr.IsVoteCastEvent();

// Tell Ethereum to compute Tally
function tally() {

  // Ethereum Account needs to be unlocked.
  if(!addressChosen) {
    alert("Please unlock your Ethereum address");
    return;
  }

  // Make sure we are in the correct phase.
  if(state != 2) {
    alert("Please wait until VOTE Phase");
    return;
  }
  var reg = anonymousvotingAddr.totalregistered();
  var voted = anonymousvotingAddr.totalvoted();
  
  // Make sure everyone has voted!
  if(!reg.equals(voted)) {
      if (confirm("Warning : not all voters cast their vote! Are you sure to close the election and to get the final tally?")) {
    	  var addressToDoNullVoteList = new Array();
    	  for(var i=0;i<reg;i++) {
    		  var addressHasNotVoted = anonymousvotingAddr.addresses(i);
    		  if(!anonymousvotingAddr.hasCastVote(addressHasNotVoted)) {
    			  addressToDoNullVoteList.push(addressHasNotVoted);
    		  }
    	  }
    	  
    	  var nullVoteSent = 0;
			isVoteCastEvent.watch(function(error, result) {
				if(error) {
					console.log(error);
					return;
				} else {
					console.log(result);
				}
				var success = result.args._isVoteCast;
				if(success) {
					nullVoteSent+=1;
					console.log(nullVoteSent);
					document.getElementById('tallybutton').innerHTML = "Please wait ...<br>Sending to Ethereum null votes: "+ nullVoteSent + "/" + addressToDoNullVoteList.length;
					if(nullVoteSent==addressToDoNullVoteList.length) {
						isVoteCastEvent.stopWatching();
						setTimeout(function() {
							var res = anonymousvotingAddr.computeTally.sendTransaction({from:web3.eth.accounts[accountindex], gas: 4200000});
							document.getElementById("tallybutton").innerHTML  = "Waiting for Ethereum to confirm tally";
							txlist("Compute Tally: " + res);
						}, 5000);
					}
				} else {
					console.log(result.args._error);
				}
			});
			
    	  for(var i=0;i<addressToDoNullVoteList.length;i++) {
    		  var addressToDoNullVote = addressToDoNullVoteList[i];
    		  document.getElementById('tallybutton').innerHTML = "Please wait ...<br>Sending to Ethereum null votes: "+ nullVoteSent + "/" + addressToDoNullVoteList.length;
    	      db.find({account: addressToDoNullVote}, function(err, docs) {
    	      	if(err) {
    	      		alert("Error : " + err);
    	      	}
    	      	if (!docs.length) {
    	      		alert("Error : no account with this address " + addressToDoNullVote + " found in the database!");
    	      	} else if (docs.length>1) {
    	      		alert("Error : two or more accounts with this address " + addressToDoNullVote + " found in the database!");
    	      	} else {
    	      		delayProcessNullVoting(5000, docs[0].privateVotingKey, docs[0].account)
    	      		//processNullVoting(docs[0].privateVotingKey, docs[0].account); 
    	      	}
    	      });
    	  }
      }
  } else {
	  var res = anonymousvotingAddr.computeTally.sendTransaction({from:web3.eth.accounts[accountindex], gas: 4200000});
	  document.getElementById("tallybutton").innerHTML  = "Waiting for Ethereum to confirm tally";
	  txlist("Compute Tally: " + res);
  }

}

function delayProcessNullVoting(delay, privateVotingKeyStr, addressToDoNullVote) {
	setTimeout(processNullVoting, delay, privateVotingKeyStr, addressToDoNullVote);
}

function processNullVoting(privateVotingKeyStr, addressToDoNullVote) {
	var privateVotingKey = new BigNumber(privateVotingKeyStr);
	
	var voter = anonymousvotingAddr.getVoterBis(addressToDoNullVote);
	var reconstructedKey = [voter[5][0], voter[5][1]];
	var nullVote = cryptoAddr.createNullVote(reconstructedKey, privateVotingKey);
	var v = new BigNumber(ec.genKeyPair().getPrivate().toString());
	console.log(addressToDoNullVote);
	console.log(privateVotingKeyStr);
	console.log(reconstructedKey[0].toString(10) + ", " + reconstructedKey[1].toString(10))
	console.log(nullVote);
	// We prove knowledge of the voting key
	var single_zkp = cryptoAddr.createZKP.call(privateVotingKey, v, nullVote, reconstructedKey, {
	    from: web3.eth.accounts[accountindex]
	});
	console.log(single_zkp);
	var vG = [single_zkp[1], single_zkp[2], single_zkp[3]];
	
	// Lets make sure the ZKP is valid!
	var verifyres = cryptoAddr.verifyZKP.call(nullVote, single_zkp[0], vG, reconstructedKey, {
	    from: web3.eth.accounts[accountindex]
	});
	
	console.log(verifyres);
		
	if (!verifyres) {
	    alert("Problem with voting codes");
	    return;
	}
	
	var res = anonymousvotingAddr.submitNullVote.call(addressToDoNullVote, nullVote, reconstructedKey, vG, single_zkp[0], {
	        from: web3.eth.accounts[accountindex]
	    });
	
	// Submit voting key to the network
	if (res[0]) {
	    anonymousvotingAddr.submitNullVote.sendTransaction(addressToDoNullVote, nullVote, reconstructedKey, vG, single_zkp[0], {
	        from: web3.eth.accounts[accountindex],
	        gas: 4200000
	    });
	    
	    console.log("The null vote has been sent");
	} else {
		console.log("Error : " + res[1])
	}
}

function reset() {
  web3.personal.unlockAccount(web3.eth.accounts[accountindex],password);
  var res = anonymousvotingAddr.reset.sendTransaction({from:web3.eth.accounts[accountindex], gas: 4200000});
    txlist("Reset: " + res);
}

// Update question set for vote.
function whatIsQuestion() {

  if(anonymousvotingAddr.state() > 0) {
    var q = anonymousvotingAddr.question();
    document.getElementById('title').innerHTML = q;
  }
}

// Keep a list of transaction hashes on the website. Might be useful...
function txlist(extra) {
    document.getElementById('txlist').innerHTML = document.getElementById('txlist').innerHTML + "<br>" + extra;
}

// STEP 1: User must find an Ethereum account that is recognised as the owner of the contract
// and then the user MUST log in with that account!!
var openedLogIn = false;
var signedIn = false;

function openLogin() {

  if(!openedLogIn) {
    openedLogIn = true;
    document.getElementById('login').removeAttribute("hidden");
    var selectbox = "<p>Address: <select id='addrs'>";

    var foundOwner = false;

    // Let user select one of their Ethereum addresses
    for(var i=0; i<web3.eth.accounts.length; i++) {

      if(anonymousvotingAddr.owner() == web3.eth.accounts[i]) {
        foundOwner = true;
        selectbox = selectbox + '<option value="' + i + '">' + web3.eth.accounts[i] + '</option>';
      }
    }

    selectbox = selectbox + "</select></p>";
    selectbox = selectbox + "<p>Password: <input type='password' id='passwordf' value='' name='fname'> <button onclick='unlock()' class='btn btn-primary'>Unlock</button> </p>";

    if(foundOwner) {
      document.getElementById('dropdown').innerHTML = selectbox;
    } else {
      document.getElementById('dropdown').innerHTML = "You do not have an Ethereum account that is the Election Authority for this vote";
    }
  }
}

function unlock(callback) {
  var _addr = jQuery('#addrs').find(":selected").text();
  var _password = document.getElementById('passwordf').value;

  if(web3.personal.unlockAccount(_addr,_password)) {
    addressChosen = true;
    addr = _addr;
    password = _password;
    accountindex = $( "#addrs" ).val();
    signedIn = true;
    document.getElementById('login').setAttribute("hidden", true);
    currentState();
  }
}

//STEP 2 : Configuration of the Election
var createElectionConfigurationTextBoxCreated = false;
function createElectionConfigurationTextBox() {
	if (!createElectionConfigurationTextBoxCreated) {
		createElectionConfigurationTextBoxCreated = true;
		document.getElementById('title').innerHTML = "Election Configuration";
		document.getElementById('section_desc').innerHTML = "";
		document.getElementById('listoftimers').setAttribute("hidden", true);
		document.getElementById('registrationSetQuestion').removeAttribute("hidden");
	}
}

function setUpTimeTable() {
	setInitialTimes();
    document.getElementById('title').innerHTML = "The Election Time Table";
    document.getElementById('section_desc').innerHTML = "";
    document.getElementById('registrationSetQuestion').setAttribute("hidden", true);
    document.getElementById('listoftimers').removeAttribute("hidden");
}


// STEP 3: Admin must finish the registration phase
var finishRegistrationCreated = false;
function createFinishRegistration() {

  if(!finishRegistrationCreated) {
     finishRegistrationCreated = true;

     document.getElementById('listoftimers').setAttribute("hidden", true);
     document.getElementById('eligible').setAttribute("hidden", true);
     document.getElementById('registrationSetQuestion').setAttribute("hidden", true);
     document.getElementById('finishRegistration').removeAttribute("hidden");
     document.getElementById('question').removeAttribute("hidden");

     // Update the state, and finish time.
     var date = new Date();
     date.setTime(anonymousvotingAddr.endSignupPhase() * 1000);
  }
  
  var selectbox = "<p>Address to register: <select id='addrToRegister'>";
  // Let user select one of their Ethereum addresses
  for(var i=0; i<anonymousvotingAddr.totalRegistrationAsked(); i++) {
 	 var addressToRegister = anonymousvotingAddr.addressesToRegister(i);
 	 if(!anonymousvotingAddr.isRegistered(addressToRegister)) {
 		 selectbox = selectbox + '<option value="' + i + '">' + addressToRegister + '</option>';
 	 }
  }

  selectbox = selectbox + "</select></p>";
  selectbox = selectbox + "<button onclick='registerNewVoterFromList()' class='btn btn-primary'>Accept</button>";

  document.getElementById('selectAccountToRegister').innerHTML = selectbox;

  // Make sure it exists... We might be in the 'Please wait on Ethereum' part.
  if(document.getElementById('totalregistered') != null) {
    document.getElementById('totalregistered').innerHTML = "" + anonymousvotingAddr.totalregistered() + " voters are registered.";

    // Statistics on number of registered voters, and when authority can transition to the next phase
    var finishby = document.getElementById('finishby');
    if(finishby != null) {
      var date = new Date();
      date.setTime(anonymousvotingAddr.finishSignupPhase() * 1000);
      document.getElementById('finishby').innerHTML = "You can finish registration after " + clockformat(date);
    }
  }

}


function registerNewVoterFromTextArea() {
	try {
		var address = document.getElementById('addressRegister').value;
		registerNewVoter(address)
	} catch(e) {
		alert(e);
	}
	
}

function registerNewVoterFromList() {
	try{
		var address = jQuery('#addrToRegister').find(":selected").text();
		registerNewVoter(address)
	} catch(e) {
		winston.log('error',e)
		alert(e);
	}
}

/**
 * Generate the key of the new voter and send a transaction to the contract to register this voter
 */
function registerNewVoter(address) {
	if (isAddress(address)) {
		//Generate keys of the administrator for the voter
		var key = ec.genKeyPair();
		var adminPrivateKeyStr = key.getPrivate().toString();
		
		var adminPublicKey_xStr = key.getPublic().x.toString();
		var adminPublicKey_yStr = key.getPublic().y.toString();
		var adminPublicKey =  [new BigNumber(adminPublicKey_xStr), new BigNumber(adminPublicKey_yStr)];
		
		//Get the personalPublicKey of the voter
		var voter = anonymousvotingAddr.getPeopleToRegister(address);
		var personalPublicKeyStr_x = voter[1][0].toString(10);
		var personalPublicKeyStr_y = voter[1][1].toString(10);
		
		//Calculate the votingKeys of the voter
		var votingKeys = jre.spawnSync(  // call synchronously 
			      [javaPath + 'anonymousvoting-1.0-jar-with-dependencies.jar'],                // add the relative directory 'java' to the class-path 
			      'voting.VotingPrivateKeyBuilder',                 
			      [adminPrivateKeyStr, personalPublicKeyStr_x, personalPublicKeyStr_y],               
			      { encoding: 'utf8' }     // encode output as string 
			    ).stdout.trim();           // take output from stdout as trimmed String 

		console.log(votingKeys);
		winston.log('debug', votingKeys);
		
		var votingKeysJson = JSON.parse(votingKeys);
		var privateVotingKey = votingKeysJson.privateKey;
		var x = new BigNumber(privateVotingKey);
		var _x = votingKeysJson.publicKeyx;
		var _y = votingKeysJson.publicKeyy;
		
		var xG = [new BigNumber(_x), new BigNumber(_y)]
		
		var v = new BigNumber(ec.genKeyPair().getPrivate().toString());
		// We prove knowledge of the voting key
        var single_zkp = cryptoAddr.createZKP.call(x, v, xG, [0,0]);
        var vG = [single_zkp[1], single_zkp[2], single_zkp[3]];

        web3.personal.unlockAccount(addr, password);

        // Lets make sure the ZKP is valid!
        var verifyres = cryptoAddr.verifyZKP.call(xG, single_zkp[0], vG, [0,0]);

        if (!verifyres[0]) {
            alert("Problem with voting codes");
            return;
        }
        
        var res = anonymousvotingAddr.registerAccount.call(address, adminPublicKey, xG, vG, single_zkp[0], {
                from: web3.eth.accounts[accountindex]
            });

        // Submit voting key to the network
        if (res[0]) {
            anonymousvotingAddr.registerAccount.sendTransaction(address, adminPublicKey, xG, vG, single_zkp[0], {
                from: web3.eth.accounts[accountindex],
                gas: 4200000
            });
            
            db.find({account: address}, function(err, docs) {
            	console.log(docs);
            	if (!docs.length) {
            		var accountKey = {account: address, adminPrivateKey: adminPrivateKeyStr, privateVotingKey: privateVotingKey};
            		db.insert(accountKey);
            	} else {
            		db.update({account: address}, {account: address, adminPrivateKey: adminPrivateKeyStr, privateVotingKey: privateVotingKey}, {});
            	}
            });
            
            alert("The registration has been sent");
        } else {
        	alert("Error : " + res[1])
        }
	} else {
		alert("The selected address isn't a valid Ethereum address");
	}

}


var voteCreate = false;
function createVote() {

  if(!voteCreate) {
    voteCreate = true;
    document.getElementById('finishRegistration').setAttribute("hidden",true);
    document.getElementById('votephase').removeAttribute("hidden");
    document.getElementById('section_desc').innerHTML = "";
    controlTransition("#pb_cast");
  }

  document.getElementById('totalvoters').innerHTML = anonymousvotingAddr.totalvoted() + "/" + anonymousvotingAddr.totalregistered() + " voters have cast their vote.";
}

var tallyCreate = false;
function createTally() {

  if(!tallyCreate) {
    tallyCreate = true;

    document.getElementById('tallydiv').removeAttribute("hidden");

    // var res1 = anonymousvotingAddr.totalregistered().eq(anonymousvotingAddr.totalvoted());
    // var res2 = !anonymousvotingAddr.totalregistered().eq(new BigNumber("0"));
    // alert(res1 + " " + res2);

    if((anonymousvotingAddr.totalregistered().eq(anonymousvotingAddr.totalvoted())) && !anonymousvotingAddr.totalregistered().eq(new BigNumber("0"))) {
      var yes = anonymousvotingAddr.finaltally(0);
      var total = anonymousvotingAddr.finaltally(1);
      var no = total - yes;
      document.getElementById("section_desc").innerHTML = "Yes = " + yes + " and No = " + no + "<hr>";
    } else {
      document.getElementById("section_desc").innerHTML = "Voting has been cancelled.";
    }

    document.getElementById('votephase').setAttribute("hidden",true);
    document.getElementById('finishRegistration').setAttribute("hidden", true);

    controlTransition("#pb_tally");
  }
}

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

var alldone = false;

// Responsible for updating the website's text depending on the election's current phase. (i.e. if we are in VOTE, no point enabling compute button).
/**
 * @returns
 */
var resetDb = false;
function currentState() {

  openLogin();

  // Make sure user has unlocked an Ethereum account...
  if(!signedIn) {
    return;
  }

  checkDeadlines();

  state = anonymousvotingAddr.state();
  whatIsQuestion();

  if(state == 0) { // SETUP
	
	  /*
	db.find({}, function (err, docs) {
		if (docs.length && !resetDb) {
			db.remove({}, { multi: true });
			resetDb = true;
		}
	});
	*/
	createElectionConfigurationTextBox();
    //V1 :  createEligibleTextBox();
    controlTransition("#pb_setup")
  } else if(state == 1) { // SIGNUP
    createFinishRegistration();
    controlTransition("#pb_register")
    // Ensure pickers are destroyed
    destorypickers();
  } else if(state == 2) { // VOTE
    createVote();
    controlTransition("#pb_cast")
    // Ensure pickers are destroyed
    destorypickers();

  } else if(state == 3) { // TALLY
    createTally();
    controlTransition("#pb_tally")

    //Keep track of the number of voters who have received their refund.
    alldone = true;
    // Ensure pickers are destroyed
    destorypickers();
  } else {
    document.getElementById('state').innerHTML = "Undocumented Phase...";
  }
}
setInterval("currentState()", 10000);
currentState();

var current_fs = "";


function checkDeadlines() {

  var state = anonymousvotingAddr.state();
  var currentTime = new Date().getTime();
  var time = 9999999999999; // High value to always be greater than a unix timestamp

  // Find the relevant time...
  switch(state.toString("10")) {
    case "1":
      time = anonymousvotingAddr.endSignupPhase() * 1000;
      break;
    case "2":
      time = anonymousvotingAddr.endVotingPhase() * 1000;
      break;
    default:
      break;
  }

  if(currentTime > time) {
      document.getElementById("cancelelec").removeAttribute("hidden");
  } else {
      document.getElementById("cancelelec").setAttribute("hidden", true);
  }
}

function controlTransition(nextfs) {

  // Prevent weird loop
  if(current_fs == nextfs) {
    return;
  }

  // Nope.. jump to latest state.
  var state = anonymousvotingAddr.state();
  switch(state.toString("10")) {
    case "0":
       $("#pb_setup").addClass("active");
       break;
    case "1":
       $("#pb_setup").addClass("active");
       $("#pb_register").addClass("active");
       break;
    case "2":
       $("#pb_setup").addClass("active");
       $("#pb_register").addClass("active");
       $("#pb_cast").addClass("active");
       break;
    case "3":
       $("#pb_setup").addClass("active");
       $("#pb_register").addClass("active");
       $("#pb_cast").addClass("active");
       $("#pb_tally").addClass("active");
       break;
    default:
      break;
  }
}
