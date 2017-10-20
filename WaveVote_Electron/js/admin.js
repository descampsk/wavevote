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

//addrProvider defined in helper.js
document.getElementById('pageVotant').href="vote.html?addr=" + addrProvider;
document.getElementById('pageAdmin').href="admin.html?addr=" + addrProvider;

var initContractsBool;
try {
	if(initContracts()) {
		initContractsBool=true;
	} else {
		initContractsBool=false;
		alert("Some contracts aren't found. Please contact an administrator !");
	}
} catch(e) {
	initContractsBool=false;
	console.log(e);
	alert(e);
}

var password = "";
var addressChosen = false;
var addr = 0;
var state = 0;
var accountindex = 0;

//STEP 1: User must find an Ethereum account that is recognised as the owner of the contract
//and then the user MUST log in with that account!!
var openedLogIn = false;
var signedIn = false;

/**
 * Open the login Box
 */
function openLogin() {
	if(!openedLogIn) {
	 openedLogIn = true;
	 document.getElementById('login').removeAttribute("hidden");
	 var selectbox = "<p>Address: <select id='addrs'>";
	
	 var foundOwner = false;
	
	 // Let user select one of their Ethereum addresses
	 for(var i=0; i<web3.eth.accounts.length; i++) {
	
	   if(WaveVoteAddr.owner() == web3.eth.accounts[i]) {
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

/**
 * Unlock the ethereum account
 * @returns
 */
function unlock() {
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

/**
 * Set up the page to choose the answers
 */
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

/**
 * Return to the page to set the question
 */
function returnSetQuestion() {
	document.getElementById('title').innerHTML = "Election Configuration";
	document.getElementById('registrationSetQuestion').removeAttribute("hidden");
	document.getElementById('registrationSetAnswers').setAttribute("hidden", true);
}

//Controls which times and dates are displayed by default
function setInitialTimes() {
	
	var endreg = new Date();
	var endsignuptime = new Date();
	
	endreg.setTime(endreg.getTime());
	// Initial time is set here.
	$('#datetimepickerfinishby').datetimepicker(
	  {minDate:'0', // Sets minimum date as today
	   value:endreg});
	
	endsignuptime.setTime(endreg.getTime());
	$('#datetimepickerendsignup').datetimepicker(
	  {minDate:'0', // Sets minimum date as today
	   value:endsignuptime});
	
	var endvotetime = new Date();
	endvotetime.setTime(endreg.getTime());
	$('#datetimepickerendvote').datetimepicker(
	  {minDate:'0', // Sets minimum date as today
	  value:endvotetime});
	
	var endrefund = new Date();
	endrefund.setTime(endvotetime.getTime());
	$('#datetimepickerendrefund').datetimepicker(
	  {minDate:'0', // Sets minimum date as today
	  value:endrefund});
	$.datetimepicker.setLocale('en');
}

/**
 * Create the page to set up the time table for the election
 * @returns
 */
function setUpTimeTable() {
	setInitialTimes();
    document.getElementById('title').innerHTML = "The Election Time Table";
    document.getElementById('section_desc').innerHTML = "";
    document.getElementById('registrationSetAnswers').setAttribute("hidden", true);
    document.getElementById('listoftimers').removeAttribute("hidden");
}

function destorypickers() {
    $('#datetimepickerfinishby').datetimepicker('destroy');
    $('#datetimepickerendsignup').datetimepicker('destroy');
    $('#datetimepickerendvote').datetimepicker('destroy');
}

//Allow people to start asking for a registration
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
  
  //Send the transaction to begin the signup
  if(WaveVoteAddr.beginSignUp.call(question, answersList, finishby, endsignup, endvote, {from:web3.eth.accounts[accountindex], value: 0 })) {
	  web3.personal.unlockAccount(addr, password);
	  var res = WaveVoteAddr.beginSignUp.sendTransaction(question, answersList, finishby, endsignup, endvote, {from:web3.eth.accounts[accountindex], gas: 4200000, value: 0 });
     destorypickers();
     
     //Delete the database
     db.remove({}, { multi: true }, function (err, numRemoved) {
    	 try {
        	 generateEachInscriptionKey();
    	 } catch(e) {
    		 alert(e);
    		 console.log(e);
    	 }

     });
     
     document.getElementById("beginRegistrationbutton").innerHTML  = "Waiting for Ethereum to confirm that Registration has started";
     txlist("Begin Registration Phase: " + res);
  } else {
     // TODO: Better error message, and perhaps JS to enforce minimum gap etc.
     alert("Ethereum will not accept those dates and times.");
  }
}

/**
 * Register a new voter from the list
 */
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

//Create the page to register a voter
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
     date.setTime(WaveVoteAddr.endSignupPhase() * 1000);
  }
  
  var selectbox = "<p>Address to register: <select id='addrToRegister'>";
  // Let user select one of their Ethereum addresses
  for(var i=0; i<WaveVoteAddr.totalRegistrationAsked(); i++) {
 	 var addressToRegister = WaveVoteAddr.addressesToRegister(i);
 	 if(!WaveVoteAddr.isRegistered(addressToRegister)) {
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
    document.getElementById('totalregistered').innerHTML = "" + WaveVoteAddr.totalregistered() + " voters are registered.";

    // Statistics on number of registered voters, and when authority can transition to the next phase
    var finishby = document.getElementById('finishby');
    if(finishby != null) {
      var date = new Date();
      date.setTime(WaveVoteAddr.finishSignupPhase() * 1000);
      document.getElementById('finishby').innerHTML = "You can finish registration after " + clockformat(date);
    }
  }

}

/**
 * Generate the key of the new voter and send a transaction to the contract to register this voter
 */
function registerNewVoter(address) {
	if (isAddress(address)) {
		//Get the personalPublicKey of the voter
		var voter = WaveVoteAddr.getPeopleToRegister(address);
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
        	        var single_zkp = cryptoAddr.createZKP.call(x, v, xG, {
    	                from: web3.eth.accounts[accountindex]
    	            });
        	        var vG = [single_zkp[1], single_zkp[2], single_zkp[3]];

        	        web3.personal.unlockAccount(addr, password);

        	        // Lets make sure the ZKP is valid!
        	        var verifyres = cryptoAddr.verifyZKP.call(xG, single_zkp[0], vG, {
    	                from: web3.eth.accounts[accountindex]
    	            });

        	        if (!verifyres[0]) {
        	            alert("Problem with voting codes");
        	            return;
        	        }
        	        
        	        var res = WaveVoteAddr.registerAccount.call(address, adminPublicKey, xG, vG, single_zkp[0], {
        	                from: web3.eth.accounts[accountindex]
        	            });

        	        // Submit voting key to the network
        	        if (res[0]) {
        	        	web3.personal.unlockAccount(addr, password);
        	        	
        	            WaveVoteAddr.registerAccount.sendTransaction(address, adminPublicKey, xG, vG, single_zkp[0], {
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

//Event to follow each transactions
var computationReconstructedKeyEvent = WaveVoteAddr.ComputationReconstructedKeyEvent();

//Allow the Election Authority to finish the registration phase...
function finishRegistration() {
	if(!addressChosen) {
	 alert("Please unlock your Ethereum address");
	 return;
	}
	
	if(state != 1) {
	 alert("Please wait until Registration Phase");
	 return;
	}
	
	if(WaveVoteAddr.totalregistered() < 3) {
	 alert("Election cannot begin until there is 3 or more registered voters");
	 return;
	}
	
	var time = new Date();
	var finishReg = WaveVoteAddr.finishSignupPhase() * 1000;
	
	var reg = WaveVoteAddr.totalregistered();
	
	//TODO retirer le false : DEBUG ONLY
	if(time.getTime() < finishReg && false) {
	 alert("Please wait until " + clockformat(new Date(finishReg)) + " before finishing registration or that all eligible voters have vote.");
	 return;
	}
	
	
	try {
		  web3.personal.unlockAccount(addr,password);
		  
		  //Watch if the transaction is done. If its done then we send the next transaction
		  computationReconstructedKeyEvent.watch(function(error, result) {
			  try {
				if(error) {
					console.log(error);
					return;
				} else {
					console.log(result);
				}
				var success = result.args._successful;
				if (success) {
					var totalRecalculatedKey = WaveVoteAddr.totalRecalculatedKey();
					var totalRegistered = WaveVoteAddr.totalregistered();
					console.log(totalRegistered);
					console.log(totalRecalculatedKey);
					
					if(totalRecalculatedKey.equals(totalRegistered)) {
						computationReconstructedKeyEvent.stopWatching();
					} else {
						var res = WaveVoteAddr.computeReconstructedKey.call(totalRecalculatedKey.add(1), {from:web3.eth.accounts[accountindex]});
						document.getElementById("finishRegistration").innerHTML  = "<p>Waiting for Ethereum to confirm that Registration has finished</p><p>" + totalRecalculatedKey + "/" + totalRegistered + " computations done.";
						if(res[0]) {
							setTimeout(function() {
								WaveVoteAddr.computeReconstructedKey.sendTransaction(totalRecalculatedKey.add(1), {from:web3.eth.accounts[accountindex], gas: 4200000});
							}, 2000);
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
			  } catch(e) {
				  console.log(e);
				  alert(e);
			  }
			});
		  
		  	//We send the first transaction to comput the first reconstructedKey
			var res = WaveVoteAddr.computeReconstructedKey.call(new BigNumber("1"), {from:web3.eth.accounts[accountindex]});
			if(res[0]) {
				var totalRegistered = WaveVoteAddr.totalregistered();
				var tx = WaveVoteAddr.computeReconstructedKey.sendTransaction(1, {from:web3.eth.accounts[accountindex], gas: 4200000});
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

var voteCreate = false;

/**
 * Create the page to follow the vote
 */
function createVote() {

  if(!voteCreate) {
    voteCreate = true;
    document.getElementById('finishRegistration').setAttribute("hidden",true);
    document.getElementById('votephase').removeAttribute("hidden");
    document.getElementById('section_desc').innerHTML = "";
    controlTransition("#pb_cast");
  }

  document.getElementById('totalvoters').innerHTML = WaveVoteAddr.totalvoted() + "/" + WaveVoteAddr.totalregistered() + " voters have cast their vote.";
}

var isVoteCastEvent = WaveVoteAddr.IsVoteCastEvent();

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
  var reg = WaveVoteAddr.totalregistered();
  var voted = WaveVoteAddr.totalvoted();
  
  web3.personal.unlockAccount(addr, password);
  
  // Make sure everyone has voted!
  if(!reg.equals(voted)) {
      if (confirm("Warning : not all voters cast their vote! Are you sure to close the election and to get the final tally?")) {
    	  
    	  //We get all address from people who have not cast their vote
    	  var addressToDoNullVoteList = new Array();
    	  for(var i=0;i<reg;i++) {
    		  var addressHasNotVoted = WaveVoteAddr.addresses(i);
    		  if(!WaveVoteAddr.hasCastVote(addressHasNotVoted)) {
    			  addressToDoNullVoteList.push(addressHasNotVoted);
    		  }
    	  }
    	  
    	  
    	  var nullVoteSent = 0;
    	  var totalVoteToCast =  addressToDoNullVoteList.length;
    	  //We watch the transaction to send the next null vote after one is accepted by ethereum
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
					//If there is no more address then we can compute the tally
					if(addressToDoNullVoteList.length==0) {
						isVoteCastEvent.stopWatching();
						var res = WaveVoteAddr.computeTally.call({from:web3.eth.accounts[accountindex], gas: 4000000});
						console.log(res);
						if(res[0]) {
							res = WaveVoteAddr.computeTally.sendTransaction({from:web3.eth.accounts[accountindex], gas: 9000000}, function(error, value) {
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
								var state = WaveVoteAddr.state();
								if(state!=3) {
									alert("Ethereum has not confirm the tally : please consider a manual tallying");
									document.getElementById("tallybutton").innerHTML  = "Ethereum has not confirm the tally : please consider a manual tallying";
								}
							}, 60000);
						} else {
							alert(res[1]);
						}
					} else { //Else we send an other null vote
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
					      		processNullVoting(docs[0].privateVotingKey, docs[0].account); 
					      	}
					      });
					}
				} else {
					console.log(result.args._error);
				}
			});

			//We send the first null vote
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
	      		processNullVoting(docs[0].privateVotingKey, docs[0].account); 
	      	}
	      });
      }
  } else { //if all people has cast their vote, we do directly the tally
	  try {
		  var res = WaveVoteAddr.computeTally.call({from:web3.eth.accounts[accountindex]});
		  
		  if (res[0]) {
			  WaveVoteAddr.computeTally.sendTransaction({from:web3.eth.accounts[accountindex], gas: 9000000});
			  document.getElementById("tallybutton").innerHTML  = "Waiting for Ethereum to confirm tally";
		  } else {
			  alert(res[1]);
		  }
	  } catch(e) {
		  console.log(e);
		  alert(e);
	  }
	  
  }

}

/**
 * Function to send the transaction of a null vote
 * @param privateVotingKeyStr the private Voting Key of the voter
 * @param addressToDoNullVote the address of the voter
 */
function processNullVoting(privateVotingKeyStr, addressToDoNullVote) {
	var privateVotingKey = new BigNumber(privateVotingKeyStr);
	
	try  {
		var voter = WaveVoteAddr.getVoterBis(addressToDoNullVote);
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
	
		var res = WaveVoteAddr.submitNullVote.call(addressToDoNullVote, nullVote, vG, vyG, single_zkp[0], {
		        from: web3.eth.accounts[accountindex]
		    });
		
		// Submit the null vote to the network
		if (res[0]) {
		    WaveVoteAddr.submitNullVote.sendTransaction(addressToDoNullVote, nullVote, vG, vyG, single_zkp[0], {
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

function manualTally() {
	  try {
		var resultDiscretLogarithm = document.getElementById('discretlogarithm').value;
		  web3.personal.unlockAccount(addr,password);
		  var res = WaveVoteAddr.manualComputeFinalTally.call(resultDiscretLogarithm, {from:web3.eth.accounts[accountindex]});
		  
		  if (res[0]) {
			  WaveVoteAddr.manualComputeFinalTally.sendTransaction(resultDiscretLogarithm, {from:web3.eth.accounts[accountindex], gas: 9000000});
			  document.getElementById("tallybutton").innerHTML  = "Waiting for Ethereum to confirm tally";
		  } else {
			  alert(res[1]);
		  }
	  } catch(e) {
		  console.log(e);
		  alert(e);
	  }
}

var tallyCreate = false;
//Create the page to get the result of the vote
function createTally() {

  if(!tallyCreate) {
    tallyCreate = true;

    document.getElementById('tallydiv').removeAttribute("hidden");

    if((WaveVoteAddr.totalregistered().eq(WaveVoteAddr.totalvoted())) && !WaveVoteAddr.totalregistered().eq(new BigNumber("0"))) {
      var totalAnswer = WaveVoteAddr.getTotalAnswers();
      var innerHtml = "";
      for (var i=0;i<totalAnswer;i++) {
    	  var answer = web3.toUtf8(WaveVoteAddr.answerList(i));
    	  var tallyAnswer = WaveVoteAddr.finalTally(i);
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


//TODO : fusionner avec resetElection
function cancelElection() {
web3.personal.unlockAccount(addr, password);
var res = WaveVoteAddr.deadlinePassed.call({ from: web3.eth.accounts[accountindex], gas: 4200000});

if(res) {
  WaveVoteAddr.forceCancelElection.sendTransaction({from: web3.eth.accounts[accountindex],gas: 4200000});
  document.getElementById("cancelelectionbutton").setAttribute("disabled",true);
  alert("Please wait a few minutes for the election to be cancelled.");
} else {
	  alert("Deadlines aren't passed : you can't cancel the election");
}

return false;
}

//TODO : fusionner avec cancelElection
function resetElection() {

var currentTime = new Date();

web3.personal.unlockAccount(addr, password);
var res = WaveVoteAddr.deadlinePassed.call({ from: web3.eth.accounts[accountindex], gas: 4200000});

if(res) {
  WaveVoteAddr.forceCancelElection.sendTransaction({from: web3.eth.accounts[accountindex],gas: 4200000});
  document.getElementById('tallydiv').innerHTML = "Please refresh your web browser in a few minutes";
} else {
	  //TODO : faire un message d'erreur
	  alert("Erreur !")
}

return false;
}

//TODO : à supprimer ??
function reset() {
  web3.personal.unlockAccount(web3.eth.accounts[accountindex],password);
  var res = WaveVoteAddr.reset.sendTransaction({from:web3.eth.accounts[accountindex], gas: 4200000});
    txlist("Reset: " + res);
}

// Update question set for vote.
function whatIsQuestion() {

  if(WaveVoteAddr.state() > 0) {
    var q = WaveVoteAddr.question();
    document.getElementById('title').innerHTML = q;
  }
}

// Keep a list of transaction hashes on the website. Might be useful...
function txlist(extra) {
    document.getElementById('txlist').innerHTML = document.getElementById('txlist').innerHTML + "<br>" + extra;
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

  state = WaveVoteAddr.state();
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

try {
	if(initContractsBool) {
		setInterval("currentState()", 10000);
		currentState();
	}
} catch(e) {
	console.log(e);
	alert(e);
}

var current_fs = "";


function checkDeadlines() {

  var state = WaveVoteAddr.state();
  var currentTime = new Date().getTime();
  var time = 9999999999999; // High value to always be greater than a unix timestamp

  // Find the relevant time...
  switch(state.toString("10")) {
    case "1":
      time = WaveVoteAddr.endSignupPhase() * 1000;
      break;
    case "2":
      time = WaveVoteAddr.endVotingPhase() * 1000;
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
  var state = WaveVoteAddr.state();
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