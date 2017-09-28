 //This requires an environment variable, which we will get to in a moment.
 //require files joining that directory variable with the location within your package of files
 const databasePath = require('path').join(directory, '/db/adminKey.db');
 const mailDataPath = require('path').join(directory, '/data/mail.csv');
 console.log("Set of the path : ok");

//Ouverture de la base de données
var Datastore = require('nedb')
var db = new Datastore({filename: databasePath, autoload: true, onload: function(error) {
	console.log(error);
}});

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

document.getElementById('pageVotant').href="vote.html?addr=" + addrProvider;
document.getElementById('pageAdmin').href="admin.html?addr=" + addrProvider;

var password = "";
var addressChosen = false;
var addr = 0;
var state = 0;
var accountindex = 0;

// Controls which times and dates are displayed by default
// We need to ensure there is a 'minimum' gap between default times too.
// TODO: When the 'gap' drop down box is used... update all times accordingly.
function setInitialTimes() {

   var endreg = new Date();
   var endsignuptime = new Date();
   var gap = anonymousvotingAddr.gap();

   endreg.setTime(endreg.getTime() + (gap*1000));
   // Initial time is set here.
   $('#datetimepickerfinishby').datetimepicker(
     {minDate:'0', // Sets minimum date as today
      value:endreg});

   endsignuptime.setTime(endreg.getTime() + (gap*1000));
   $('#datetimepickerendsignup').datetimepicker(
     {minDate:'0', // Sets minimum date as today
      value:endsignuptime});

   var endvotetime = new Date();
   endvotetime.setTime(endreg.getTime() + (gap*1000));
   $('#datetimepickerendvote').datetimepicker(
     {minDate:'0', // Sets minimum date as today
     value:endvotetime});

   var endrefund = new Date();
   endrefund.setTime(endvotetime.getTime() + (gap*1000));
   $('#datetimepickerendrefund').datetimepicker(
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
  
  var answersList = new Array();
  answersList.push(web3.toHex("Null vote"));
  var totalAnswer = document.getElementById('totalAnswerInput').value;
  
  for(var i=1;i<=totalAnswer;i++) {
	  var answer = document.getElementById('answer' + i).value;
	  
	  answersList.push(web3.toHex(answer))
  }
  
  console.log(answersList);
  
  if(anonymousvotingAddr.beginSignUp.call(question, answersList, finishby, endsignup, endvote, {from:web3.eth.accounts[accountindex], value: 0 })) {
	  web3.personal.unlockAccount(addr, password);
	  var res = anonymousvotingAddr.beginSignUp.sendTransaction(question, answersList, finishby, endsignup, endvote, {from:web3.eth.accounts[accountindex], gas: 4200000, value: 0 });
     destorypickers();
     
     //Delete the database
     db.remove({}, { multi: true }, function (err, numRemoved) {
    	 generateEachInscriptionKey();
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

var computationReconstructedKeyEvent = anonymousvotingAddr.ComputationReconstructedKeyEvent();

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
  
  
  try {
	  web3.personal.unlockAccount(addr,password);
	  
	  computationReconstructedKeyEvent.watch(function(error, result) {
			if(error) {
				console.log(error);
				return;
			} else {
				console.log(result);
			}
			var success = result.args._successful;
			if (success) {
				var totalRecalculatedKey = anonymousvotingAddr.totalRecalculatedKey();
				var totalRegistered = anonymousvotingAddr.totalregistered();
				console.log(totalRegistered);
				console.log(totalRecalculatedKey);
				
				if(totalRecalculatedKey.equals(totalRegistered)) {
					computationReconstructedKeyEvent.stopWatching();
				} else {
					var res = anonymousvotingAddr.computeReconstructedKey.call(totalRecalculatedKey.add(1));
					document.getElementById("finishRegistration").innerHTML  = "<p>Waiting for Ethereum to confirm that Registration has finished</p><p>" + totalRecalculatedKey + "/" + totalRegistered + " computations done.";
					if(res[0]) {
						anonymousvotingAddr.computeReconstructedKey.sendTransaction(totalRecalculatedKey.add(1), {from:web3.eth.accounts[accountindex], gas: 4200000});
					} else {
						console.log(res[1]),
						alert(res[1]);
					}		
				}
			} else {
				var message = result.args._message;
				console.log(message);
				alert(message);
			}
		});
		var res = anonymousvotingAddr.computeReconstructedKey.call(1);
		if(res[0]) {
			var totalRegistered = anonymousvotingAddr.totalregistered();
			var tx = anonymousvotingAddr.computeReconstructedKey.sendTransaction(1, {from:web3.eth.accounts[accountindex], gas: 4200000});
			document.getElementById("finishRegistration").innerHTML  = "<p>Waiting for Ethereum to confirm that Registration has finished</p><p>0/" + totalRegistered + " computations done.";
			txlist("Finish Registration Phase: " + tx);
		} else {
			console.log(res[1]),
			alert(res[1]);
		}	
	  
  } catch(e) {
	  console.log(e);
	  alert(e);
  }
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
  
  web3.personal.unlockAccount(addr, password);
  
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
    	  var totalVoteToCast =  addressToDoNullVoteList.length;
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
					document.getElementById('tallybutton').innerHTML = "Please wait ...<br>Sending to Ethereum null votes: "+ nullVoteSent + "/" + totalVoteToCast;
					if(addressToDoNullVoteList.length==0) {
						isVoteCastEvent.stopWatching();
						var res = anonymousvotingAddr.computeTally.call({from:web3.eth.accounts[accountindex], gas: 4000000});
						console.log(res);
						if(res[0]) {
							res = anonymousvotingAddr.computeTally.sendTransaction({from:web3.eth.accounts[accountindex], gas: 9000000}, function(error, value) {
								if(error) {
									alert("Error : please consider a manual tallying");
									console.error(error);
								} else {
									console.log(value);
								}
							});
							document.getElementById("tallybutton").innerHTML  = "Waiting for Ethereum to confirm tally";
							txlist("Compute Tally: " + res);
							setTimeout(function() {
								var state = anonymousvotingAddr.state();
								if(state!=3) {
									alert("Ethereum has not confirm the tally : please consider a manual tallying");
									document.getElementById("tallybutton").innerHTML  = "Ethereum has not confirm the tally : please consider a manual tallying";
								}
							}, 60000);
						} else {
							alert(res[1]);
						}
					} else {
						  var addressToDoNullVote = addressToDoNullVoteList.pop();
					      db.find({account: addressToDoNullVote}, function(err, docs) {
					      	if(err) {
					      		alert("Error : " + err);
					      	}
					      	if (!docs.length) {
					      		alert("Error : no account with this address " + addressToDoNullVote + " found in the database!");
					      	} else if (docs.length>1) {
					      		alert("Error : two or more accounts with this address " + addressToDoNullVote + " found in the database!");
					      	} else {
					      		//delayProcessNullVoting(5000, docs[0].privateVotingKey, docs[0].account)
					      		processNullVoting(docs[0].privateVotingKey, docs[0].account); 
					      	}
					      });
					}
				} else {
					console.log(result.args._error);
				}
			});

		  var addressToDoNullVote = addressToDoNullVoteList.pop();
		  document.getElementById('tallybutton').innerHTML = "Please wait ...<br>Sending to Ethereum null votes: "+ nullVoteSent + "/" + totalVoteToCast;
	      db.find({account: addressToDoNullVote}, function(err, docs) {
	      	if(err) {
	      		alert("Error : " + err);
	      	}
	      	if (!docs.length) {
	      		alert("Error : no account with this address " + addressToDoNullVote + " found in the database!");
	      	} else if (docs.length>1) {
	      		alert("Error : two or more accounts with this address " + addressToDoNullVote + " found in the database!");
	      	} else {
	      		//delayProcessNullVoting(5000, docs[0].privateVotingKey, docs[0].account)
	      		processNullVoting(docs[0].privateVotingKey, docs[0].account); 
	      	}
	      });
      }
  } else {
	  try {
		  var res = anonymousvotingAddr.computeTally.call({from:web3.eth.accounts[accountindex]});
		  
		  if (res) {
			  anonymousvotingAddr.computeTally.sendTransaction({from:web3.eth.accounts[accountindex], gas: 9000000});
			  document.getElementById("tallybutton").innerHTML  = "Waiting for Ethereum to confirm tally";
			  txlist("Compute Tally: " + res);
		  }
	  } catch(e) {
		  console.log(e);
		  alert(e);
	  }
	  
  }

}

function delayProcessNullVoting(delay, privateVotingKeyStr, addressToDoNullVote) {
	setTimeout(processNullVoting, delay, privateVotingKeyStr, addressToDoNullVote);
}

function processNullVoting(privateVotingKeyStr, addressToDoNullVote) {
	var privateVotingKey = new BigNumber(privateVotingKeyStr);
	
	try  {
		var voter = anonymousvotingAddr.getVoterBis(addressToDoNullVote);
		var reconstructedKey = [voter[5][0], voter[5][1]];
		var xG = [voter[4][0], voter[4][1]];
		var nullVote = cryptoAddr.createNullVote(reconstructedKey, privateVotingKey);
		var v = new BigNumber(ec.genKeyPair().getPrivate().toString());
		
		console.log(addressToDoNullVote);
		console.log(privateVotingKeyStr);
		console.log(reconstructedKey[0].toString(10) + ", " + reconstructedKey[1].toString(10))
		console.log(nullVote);
		// We prove that the vote is null and that is the right key
		var single_zkp = cryptoAddr.createZKPNullVote.call(privateVotingKey, v, reconstructedKey, {
		    from: web3.eth.accounts[accountindex]
		});
		console.log(single_zkp);
		var vG = [single_zkp[1], single_zkp[2], single_zkp[3]];
		var vyG = [single_zkp[4], single_zkp[5], single_zkp[6]];
		
		// Lets make sure the ZKP is valid!
		var verifyresNullVote = cryptoAddr.verifyZKPNullVote.call(xG, reconstructedKey, nullVote, single_zkp[0], vG, vyG, {
		    from: web3.eth.accounts[accountindex]
		});
		console.log(verifyresNullVote);
		
			
		if (!verifyresNullVote[0]) {
		    alert(verifyresNullVote[1]);
		    return;
		}
	
		var res = anonymousvotingAddr.submitNullVote.call(addressToDoNullVote, nullVote, vG, vyG, single_zkp[0], {
		        from: web3.eth.accounts[accountindex]
		    });
		
		// Submit voting key to the network
		if (res[0]) {
		    anonymousvotingAddr.submitNullVote.sendTransaction(addressToDoNullVote, nullVote, vG, vyG, single_zkp[0], {
		        from: web3.eth.accounts[accountindex],
		        gas: 4200000
		    });
		    
		    console.log("The null vote has been sent");
		} else {
			console.log("Error : " + res[1])
		}
	} catch(e) {
		console.log(e);
		alert(e);
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
	
  try {
	  var _addr = $('#addrs').find(":selected").text();
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
  } catch(e) {
	  console.log(e);
	  alert(e);
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

function setUpAnswers() {
    document.getElementById('registrationSetQuestion').setAttribute("hidden", true);
    document.getElementById('registrationSetAnswers').removeAttribute("hidden");
    
    var question = document.getElementById('questioninput').value;
    document.getElementById('title').innerHTML = question;
    
    var totalAnswer = document.getElementById('totalAnswerInput').value;
    var innerHtlm = "";
    for(var i=1;i<=totalAnswer;i++) {
    	innerHtlm+= "<p> Answer " + i + " : <input type='text' id='answer" + i + "' value='Answer " + i + "'/> </p>";
    }
    document.getElementById('answersList').innerHTML = innerHtlm;
    
}

function returnSetQuestion() {
	document.getElementById('title').innerHTML = "Election Configuration";
	document.getElementById('registrationSetQuestion').removeAttribute("hidden");
	document.getElementById('registrationSetAnswers').setAttribute("hidden", true);
}

function setUpTimeTable() {
	setInitialTimes();
    document.getElementById('title').innerHTML = "The Election Time Table";
    document.getElementById('section_desc').innerHTML = "";
    document.getElementById('registrationSetAnswers').setAttribute("hidden", true);
    document.getElementById('listoftimers').removeAttribute("hidden");
}


// STEP 3: Admin must finish the registration phase
var finishRegistrationCreated = false;
function createFinishRegistration() {

  if(!finishRegistrationCreated) {
     finishRegistrationCreated = true;

     document.getElementById('listoftimers').setAttribute("hidden", true);
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
  
  if (document.getElementById('selectAccountToRegister')!=null) {
	  document.getElementById('selectAccountToRegister').innerHTML = selectbox;
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
		var address = $('#addrToRegister').find(":selected").text();
		registerNewVoter(address)
	} catch(e) {
		winston.log('error',e)
		console.log(e);
		alert(e);
	}
}

/**
 * Generate the key of the new voter and send a transaction to the contract to register this voter
 */
function registerNewVoter(address) {
	if (isAddress(address)) {
		//Get the personalPublicKey of the voter
		var voter = anonymousvotingAddr.getPeopleToRegister(address);
		var inscriptionCode = web3.toUtf8(voter[2]);
		
        db.findOne({_id: inscriptionCode}, function(err, doc) {
        	console.log(doc);
        	if(doc==null) {
        		alert("The inscription code of this voter isn't valid");
        	} else {
        		var name = doc.name;
        		var lastName = doc.lastName;
        		if(confirm("You are going to register the voter " + name + " " + lastName + "...")) {
        			//Generate keys of the administrator for the voter
        			var key = ec.genKeyPair();
        			var adminPrivateKeyStr = key.getPrivate().toString();
        			
        			var adminPublicKey_xStr = key.getPublic().x.toString();
        			var adminPublicKey_yStr = key.getPublic().y.toString();
        			var adminPublicKey =  [new BigNumber(adminPublicKey_xStr), new BigNumber(adminPublicKey_yStr)];
        			

        			
        			var personalPublicKey = [voter[1][0], voter[1][1]];
        			var res = cryptoAddr.buildVotingPrivateKey.call(new BigNumber(adminPrivateKeyStr), personalPublicKey);
        	        console.log(res);

        	        var x = res[0];
        	        var xG = [res[1][0], res[1][1]];
        			
        			var v = new BigNumber(ec.genKeyPair().getPrivate().toString());
        			// We prove knowledge of the voting key
        	        var single_zkp = cryptoAddr.createZKP.call(x, v, xG);
        	        var vG = [single_zkp[1], single_zkp[2], single_zkp[3]];

        	        web3.personal.unlockAccount(addr, password);

        	        // Lets make sure the ZKP is valid!
        	        var verifyres = cryptoAddr.verifyZKP.call(xG, single_zkp[0], vG);

        	        if (!verifyres[0]) {
        	            alert("Problem with voting codes");
        	            return;
        	        }
        	        
        	        var res = anonymousvotingAddr.registerAccount.call(address, adminPublicKey, xG, vG, single_zkp[0], {
        	                from: web3.eth.accounts[accountindex]
        	            });

        	        // Submit voting key to the network
        	        if (res[0]) {
        	        	web3.personal.unlockAccount(addr, password);
        	        	
        	            anonymousvotingAddr.registerAccount.sendTransaction(address, adminPublicKey, xG, vG, single_zkp[0], {
        	                from: web3.eth.accounts[accountindex],
        	                gas: 4200000
        	            });
        	            
        	            db.update({_id: inscriptionCode}, {name: doc.name, lastName: doc.lastName, mail: doc.mail, account: address, adminPrivateKey: adminPrivateKeyStr, privateVotingKey: x.toString(10)}, {});
        	            
        	            alert("The registration has been sent");
        	        } else {
        	        	alert("Error : " + res[1])
        	        }
        		}
        	}
        });

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
      var totalAnswer = anonymousvotingAddr.getTotalAnswers();
      var innerHtml = "";
      for (var i=0;i<totalAnswer;i++) {
    	  var answer = web3.toUtf8(anonymousvotingAddr.answerList(i));
    	  var tallyAnswer = anonymousvotingAddr.finalTally(i);
    	  innerHtml+= "<p>" + answer + " : " + tallyAnswer + "<\p>";
      }
      document.getElementById("section_desc").innerHTML = innerHtml;
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
	
	try {
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
    // Ensure pickers are destroyed
    destorypickers();
  } else {
    document.getElementById('state').innerHTML = "Undocumented Phase...";
  }
  
	} catch(e) {
		console.log(e);
		alert(e);
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