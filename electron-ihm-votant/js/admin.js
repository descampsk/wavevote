/**
 * 
 */
// Relevant code that talks to Ethereum
var web3;
var password = "";
var addressChosen = false;
var addr = 0;
var state = 0;
var accountindex = 0;

var $ = require('jQuery')

var Web3 = require('web3');

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.99.100:8545"));
}

// Anonymous Voting Contract
var abi = [ { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "eligible", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "vG", "type": "uint256[3]" }, { "name": "r", "type": "uint256" } ], "name": "register", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": true, "type": "function" }, { "constant": false, "inputs": [], "name": "computeTally", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "addressid", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totaleligible", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "endSignupPhase", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "question", "outputs": [ { "name": "", "type": "string", "value": "No question set" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "addr", "type": "address[]" } ], "name": "setEligible", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "finishSignupPhase", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "finishRegistrationPhase", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "params", "type": "uint256[4]" }, { "name": "y", "type": "uint256[2]" }, { "name": "a1", "type": "uint256[2]" }, { "name": "b1", "type": "uint256[2]" }, { "name": "a2", "type": "uint256[2]" }, { "name": "b2", "type": "uint256[2]" } ], "name": "submitVote", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "gap", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "votecast", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "deadlinePassed", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalvoted", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "params", "type": "uint256[4]" }, { "name": "y", "type": "uint256[2]" }, { "name": "a1", "type": "uint256[2]" }, { "name": "b1", "type": "uint256[2]" }, { "name": "a2", "type": "uint256[2]" }, { "name": "b2", "type": "uint256[2]" } ], "name": "verify1outof2ZKP", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0x7a4e839863f5862352efd06ab89af8ec72a9e7a5" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "endVotingPhase", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "registered", "outputs": [ { "name": "", "type": "bool", "value": false } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "x", "type": "uint256" }, { "name": "_yG", "type": "uint256[2]" }, { "name": "_voteCrypted", "type": "uint256[2]" } ], "name": "checkVote", "outputs": [ { "name": "temp1_bis", "type": "uint256[3]", "value": [ "0", "0", "0" ] }, { "name": "temp2_bis", "type": "uint256[3]", "value": [ "0", "0", "0" ] }, { "name": "temp4", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "refunds", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "state", "outputs": [ { "name": "", "type": "uint8", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "finaltally", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_address", "type": "address" } ], "name": "getVoter", "outputs": [ { "name": "_registeredkey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_reconstructedkey", "type": "uint256[2]", "value": [ "0", "0" ] }, { "name": "_vote", "type": "uint256[2]", "value": [ "0", "0" ] } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalregistered", "outputs": [ { "name": "", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_question", "type": "string" }, { "name": "_finishSignupPhase", "type": "uint256" }, { "name": "_endSignupPhase", "type": "uint256" }, { "name": "_endVotingPhase", "type": "uint256" } ], "name": "beginSignUp", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "voters", "outputs": [ { "name": "addr", "type": "address", "value": "0x0000000000000000000000000000000000000000" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "forceCancelElection", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "uint256" } ], "name": "addresses", "outputs": [ { "name": "", "type": "address", "value": "0x" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "accountToRegister", "type": "address" }, { "name": "xG", "type": "uint256[2]" }, { "name": "vG", "type": "uint256[3]" }, { "name": "r", "type": "uint256" } ], "name": "registerAccount", "outputs": [ { "name": "_successful", "type": "bool" }, { "name": "_error", "type": "string" } ], "payable": true, "type": "function" }, { "constant": false, "inputs": [ { "name": "xG", "type": "uint256[2]" }, { "name": "r", "type": "uint256" }, { "name": "vG", "type": "uint256[3]" } ], "name": "verifyZKP", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "type": "function" }, { "inputs": [ { "name": "_gap", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;gap", "template": "elements_input_uint", "value": "0" } ], "payable": false, "type": "constructor" } ];
var anonymousvoting = web3.eth.contract(abi);
var anonymousvotingAddr = anonymousvoting.at("0x018A0B0476FF77897AC1f04Ec1e14c15957896D7");

// Local Crypto Contract
var abi_crypto = [{"constant":false,"inputs":[{"name":"params","type":"uint256[4]"},{"name":"xG","type":"uint256[2]"},{"name":"yG","type":"uint256[2]"},{"name":"y","type":"uint256[2]"},{"name":"a1","type":"uint256[2]"},{"name":"b1","type":"uint256[2]"},{"name":"a2","type":"uint256[2]"},{"name":"b2","type":"uint256[2]"}],"name":"commitToVote","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"xG","type":"uint256[2]"},{"name":"yG","type":"uint256[2]"},{"name":"w","type":"uint256"},{"name":"r2","type":"uint256"},{"name":"d2","type":"uint256"},{"name":"x","type":"uint256"}],"name":"create1outof2ZKPNoVote","outputs":[{"name":"res","type":"uint256[10]"},{"name":"res2","type":"uint256[4]"}],"type":"function"},{"constant":false,"inputs":[{"name":"a","type":"uint256"},{"name":"b","type":"uint256"}],"name":"submod","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":false,"inputs":[{"name":"x","type":"uint256"},{"name":"v","type":"uint256"},{"name":"xG","type":"uint256[2]"}],"name":"createZKP","outputs":[{"name":"res","type":"uint256[4]"}],"type":"function"},{"constant":false,"inputs":[{"name":"params","type":"uint256[4]"},{"name":"xG","type":"uint256[2]"},{"name":"yG","type":"uint256[2]"},{"name":"y","type":"uint256[2]"},{"name":"a1","type":"uint256[2]"},{"name":"b1","type":"uint256[2]"},{"name":"a2","type":"uint256[2]"},{"name":"b2","type":"uint256[2]"}],"name":"verify1outof2ZKP","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[{"name":"xG","type":"uint256[2]"},{"name":"yG","type":"uint256[2]"},{"name":"w","type":"uint256"},{"name":"r1","type":"uint256"},{"name":"d1","type":"uint256"},{"name":"x","type":"uint256"}],"name":"create1outof2ZKPYesVote","outputs":[{"name":"res","type":"uint256[10]"},{"name":"res2","type":"uint256[4]"}],"type":"function"},{"constant":false,"inputs":[{"name":"xG","type":"uint256[2]"},{"name":"r","type":"uint256"},{"name":"vG","type":"uint256[3]"}],"name":"verifyZKP","outputs":[{"name":"","type":"bool"}],"type":"function"},{"inputs":[],"type":"constructor"}];
var crypto_contract = web3.eth.contract(abi_crypto);
var cryptoAddr = crypto_contract.at("0x26A5bB2c241652f8c6C6Fd7fB02De5f16f6103c8");

//Ouverture de la base de données
var Datastore = require('nedb')
var db = new Datastore({filename: 'db/key.db', autoload: true});

//Create and initialize EC context
//(better do it once and reuse it)
//var EC = require('ellipticjs').ec;
var ec = new elliptic.ec('secp256k1');

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
    anonymousvotingAddr.deadlinePassed.sendTransaction({from: web3.eth.accounts[accountindex],gas: 4200000});
    document.getElementById("cancelelectionbutton").setAttribute("disabled",true);
    alert("Please wait a few minutes for the election to be cancelled.");
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
  var eligible = anonymousvotingAddr.totaleligible();
  
  if(time.getTime() < finishReg && !reg.equals(eligible)) {
    alert("Please wait until " + clockformat(new Date(finishReg)) + " before finishing registration or that all eligible voters have vote.");
    return;
  }
  

  web3.personal.unlockAccount(addr,password);

  res = anonymousvotingAddr.finishRegistrationPhase.sendTransaction({from:web3.eth.accounts[accountindex], gas: 4200000});
  document.getElementById("finishRegistration").innerHTML  = "Waiting for Ethereum to confirm that Registration has finished";

  txlist("Finish Registration Phase: " + res);
}

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
     alert("Please wait for everyone to vote");
     return;
  }

  //TODO: Check that all votes have been cast..
  // Can do this by checking the public 'votecast' mapping...
  web3.personal.unlockAccount(web3.eth.accounts[accountindex],password);
  var res = anonymousvotingAddr.computeTally.sendTransaction({from:web3.eth.accounts[accountindex], gas: 4200000});
  document.getElementById("tallybutton").innerHTML  = "Waiting for Ethereum to confirm tally";
  txlist("Compute Tally: " + res);
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

/*
// STEP 2: Admin must be able to set a list of eligible voters
var eligibletextboxCreated = false;
function createEligibleTextBox() {

  if(!eligibletextboxCreated) {
    eligibletextboxCreated = true;
    document.getElementById('title').innerHTML = "List of Eligible Voters";
    document.getElementById('question').setAttribute("hidden", true);
    document.getElementById('eligible').removeAttribute("hidden");

    // LAZY: Pre-fill the text box with my own addresses.
    for(var i=1; i<41; i++) {
       document.getElementById('addresses').value = document.getElementById('addresses').value + web3.eth.accounts[i] + ",";
    }
  }

  var res = anonymousvotingAddr.totaleligible().equals(new BigNumber("40"));
  var isHidden = document.getElementById('eligible').hasAttribute('hidden');

  if(!res && !isHidden) {
    document.getElementById('section_desc').innerHTML = "There is currently <span id='totaleligible'>0</span> eligible voters. <br> Would you like to add more?";
    document.getElementById('totaleligible').innerHTML = anonymousvotingAddr.totaleligible() + "/40";
  } else if(!isHidden) {
    document.getElementById('section_desc').innerHTML = "There is currently <span id='totaleligible'>0</span> eligible voters. <br> You cannot add any more voters.";
    document.getElementById('totaleligible').innerHTML = anonymousvotingAddr.totaleligible() + "/40";
    document.getElementById('eligible_area').setAttribute("hidden",true);
  }

}

function finishEligible() {
  if(anonymousvotingAddr.totaleligible() >= 3) {
    setInitialTimes();
    document.getElementById('title').innerHTML = "The Election Time Table";
    document.getElementById('section_desc').innerHTML = "";
    document.getElementById('eligible').setAttribute("hidden", true);
    document.getElementById('listoftimers').removeAttribute("hidden");
  } else {
    alert("A minimum number of 3 eligible voters is required before continuing.");
  }
}

function finishSetUp() {
	setInitialTimes();
    document.getElementById('title').innerHTML = "The Election Time Table";
    document.getElementById('section_desc').innerHTML = "";
    document.getElementById('listoftimers').removeAttribute("hidden");
}

var finishSettingTimes = false;

function finishSetTimes() {
  document.getElementById('title').innerHTML = "Election Configuration";
  document.getElementById('section_desc').innerHTML = "";
  document.getElementById('listoftimers').setAttribute("hidden", true);
  document.getElementById('registrationSetQuestion').removeAttribute("hidden");
}

**/

// STEP 3: Admin must finish the registration phase
var finishRegistrationCreated = false;
function createFinishRegistration() {

  if(!finishRegistrationCreated) {
     finishRegistrationCreated = true;
     //V2 : document.getElementById('title').innerHTML = "Voter Registration";
     document.getElementById('listoftimers').setAttribute("hidden", true);
     document.getElementById('eligible').setAttribute("hidden", true);
     document.getElementById('registrationSetQuestion').setAttribute("hidden", true);
     document.getElementById('finishRegistration').removeAttribute("hidden");
     document.getElementById('question').removeAttribute("hidden");

     // Update the state, and finish time.
     var date = new Date();
     date.setTime(anonymousvotingAddr.endSignupPhase() * 1000);
  }

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


/**
 * Generate the key of the new voter and send a transaction to the contract to register this voter
 */
function registerNewVoter() {
	var address = document.getElementById('addressRegister').value;
	
	if (isAddress(address)) {
		//Generate keys of the new voter
		var key = ec.genKeyPair();
		var x = new BigNumber(key.getPrivate().toString());
		//x = new BigNumber("6959887475939879634657453300833665249729495309926027309660679704549321604357");
		console.log(key.getPrivate().toString());
		
		var _x = key.getPublic().x.toString();
		//_x = "78019442854369070734606356417324367102708779656641891835271466081108792483995";
		var _y = key.getPublic().y.toString();
		//_y = "81177259980896688224623289645487454948080985310841243675059192092210790040475";
		var xG =  [new BigNumber(_x), new BigNumber(_y)];
		console.log(_x);
		console.log(_y);
		
		var v = new BigNumber(ec.genKeyPair().getPrivate().toString());

		
		// We prove knowledge of the voting key
        var single_zkp = cryptoAddr.createZKP.call(x, v, xG, {
            from: web3.eth.accounts[accountindex]
        });
        var vG = [single_zkp[1], single_zkp[2], single_zkp[3]];

        web3.personal.unlockAccount(addr, password);

        // Lets make sure the ZKP is valid!
        var verifyres = cryptoAddr.verifyZKP.call(xG, single_zkp[0], vG, {
            from: web3.eth.accounts[accountindex]
        });

        if (!verifyres) {
            alert("Problem with voting codes");
            return;
        }
        
        console.log(web3.eth.accounts[accountindex]);
        var res = anonymousvotingAddr.registerAccount.call(address, xG, vG, single_zkp[0], {
                from: web3.eth.accounts[accountindex]
            });
        console.log(res);
        // Submit voting key to the network
        if (res[0]) {
            anonymousvotingAddr.registerAccount.sendTransaction(address, xG, vG, single_zkp[0], {
                from: web3.eth.accounts[accountindex],
                gas: 4200000
            });
            
            db.find({account : addr}, function(err, docs) {
            	if (docs == []) {
            		console.log("ok");
            		var key = {account: addr, privatekey: x};
            		db.insert(key);
            	} else {
            		db.update({account: addr}, {privatekey: x}, {});
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