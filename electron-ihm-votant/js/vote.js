/**
 * @see helper.js for all init variables
 */

//This requires an environment variable, which we will get to in a moment.
//require files joining that directory variable with the location within your package of files
const databasePath = require('path').join(directory, '/db/votersKey.db');
const javaPath = require('path').join(directory, '/java/');

//Ouverture de la base de données
var Datastore = require('nedb')
var db = new Datastore({filename: databasePath, autoload: true, onload: function(error) {
	console.log(error);
}});


var paramUrl = location.search.substring(1);
var addrProvider = paramUrl.split('=')[1];

document.getElementById('pageVotant').href="vote.html?addr=" + addrProvider;
document.getElementById('pageAdmin').href="admin.html?addr=" + addrProvider;

var password = "";
var addressChosen = false;
var addr = 0;
var state = 0;
var accounts_index = 0;

//Check if we are really connected to the Ethereum Node
if(!web3.isConnected()) {
	alert("Error : you are not connected to the Ethereum Node !");
}

console.log("init ok");

//TODO : à mettre dans l'html
function openNewPasswordBox() {
	var selectbox2 = "<br><p>Création d'un compte Ethereum</p><br><p>Veuillez rentrer un mot de passe :</p><br><input type='password' id='passwordNewAccount' value='ilikelittlepaddy' name='fname' class='action-text'> <input id='done2' class='hidden next' type='button'> <input type='button' class='action-button'  value = 'Créer' onclick='createAccountEthereum();'>";
    document.getElementById('dropdown2').innerHTML = selectbox2;
}

function createAccountEthereum() {
	var _password = document.getElementById('passwordNewAccount').value;
    document.getElementById('passwordNewAccount').value = "";
    var addressAccount = web3.personal.newAccount(_password)
	alert("L'adresse de vote compte est : " + addressAccount +" . Veuillez bien la noter.")
    
    var box = "<button onclick='openNewPasswordBox();' class='action-button'>Create</button><button onclick='reloadPage();' class='action-button'>Reload the page</button>"
    document.getElementById('dropdown2').innerHTML = box;
}
	

    // Fetch all the Ethereum addresses...
    function selectBox() {

        // Only run if user has not yet chosen an Ethereum address.
        if (!addressChosen) {
            var listAddr = "";
            // Let user select one of their Ethereum addresses
            for (var i = 0; i < web3.eth.accounts.length; i++) {
                var tempaddr = web3.eth.accounts[i];
                listAddr = listAddr + '<option value="' + i + '">' + tempaddr + '</option>';
            }

            var selectbox = "<p>Select your ethereum account:</p><select id='addrs' class='action-list'>" + listAddr + "</select> <br><br><p>Password:</p> <input type='password' id='passwordf' value='ilikelittlepaddy' name='fname' class='action-text'> <input id='done2' class='hidden next' type='button'> <input type='button' class='action-button'  value = 'Login' onclick='unlock();'>";
            document.getElementById('dropdown').innerHTML = selectbox;
        }
    }

    function unlock() {
        var _addr = $('#addrs').find(":selected").text();
        var _password = document.getElementById('passwordf').value;
        document.getElementById('passwordf').value = "";
        
        try {
	        web3.personal.unlockAccount(_addr, _password);
	        addressChosen = true;
	        addr = _addr;
	        password = _password;
	        accounts_index = $("#addrs").val();
	        controlTransition("#unlockfs", null);
	        currentState();
	        //V2 : controlTransition("#registerTestfs", null);
	        //document.getElementById('generalStatus').innerHTML = "You have selected the address " + addr;
        } catch (e) {
        	console.log(e);
        	alert(e);
        }

    }
    
    function askOneEther() {
        if (!addressChosen) {
            alert("Please unlock your Ethereum address");
            return;
        }
        
        try { 	
	        var xmlHttp = new XMLHttpRequest();
	        xmlHttp.open( "GET", "http://10.120.3.16:3000?account=" + web3.eth.accounts[accounts_index] , false ); // false for synchronous request
	        xmlHttp.send( null );
	        console.log(xmlHttp);
	        alert(xmlHttp.responseText);
        } catch(e) {
        	console.log(e);
        	alert(e);
        }
    }
    
    function askForRegistration() {
        if (!addressChosen) {
            alert("Please unlock your Ethereum address");
            return;
        }

        if (state != 1) {
            alert("You can only ask for registration during the SIGNUP Phase ");
            return;
        }
        
		//Generate keys of the new voter
		var key = ec.genKeyPair();
		var x = new BigNumber(key.getPrivate().toString());
		
		var _x = key.getPublic().x.toString();
		var _y = key.getPublic().y.toString();
		
		var personalPublicKey =  [new BigNumber(_x), new BigNumber(_y)];
		
		var inscriptionCode = document.getElementById('inscriptionCodeInput').value;
        
        var res = anonymousvotingAddr.askForRegistration.call(personalPublicKey, inscriptionCode, {
            from: web3.eth.accounts[accounts_index]
        });

	    // Submit voting key to the network
	    if (res[0]) {
	    	try {
	    		web3.personal.unlockAccount(addr, password);
	    		
		        anonymousvotingAddr.askForRegistration.sendTransaction(personalPublicKey, inscriptionCode, {
		            from: web3.eth.accounts[accounts_index],
		            gas: 4200000,
		            value: 0
		        });
		        
		        var address = web3.eth.accounts[accounts_index];
		        db.find({account: address}, function(err, docs) {
	            	if (!docs.length) {
	            		var accountKey = {account: address, personalPrivateKey: key.getPrivate().toString()};
	            		db.insert(accountKey);
	            	} else {
	            		db.update({account: addr}, {account: address, personalPrivateKey: key.getPrivate().toString()}, {});
	            	}
	            });
		
		        //TODO: DUPLICATED CODE FROM CURRENTSTATE. Needs its own function.
		        document.getElementById('inscriptionCode').setAttribute("hidden",true);
		        document.getElementById('registerbutton').setAttribute("hidden",true);
		        document.getElementById("registrationprogress").removeAttribute("hidden");
		        document.getElementById("submitregistration").removeAttribute("hidden");
	    	} catch (e) {
	    		console.log(e);
	    		alert("The transaction of your registration's demand failed...");
	    	}
	
	    } else {
	        alert(res[1]);
	    }
    }

    // Vote submits their voting key.
    function register() {

        if (!uploaded) {
            alert("Please upload your voting codes");
        }

        if (!addressChosen) {
            alert("Please unlock your Ethereum address");
            return;
        }

        if (state != 1) {
            alert("You can only register during the SIGNUP Phase ");
            return;
        }

        if (!anonymousvotingAddr.eligible(addr)) {
            alert("Your Ethereum Account is not eligible for this vote");
            return;
        }

        // We prove knowledge of the voting key
        var single_zkp = cryptoAddr.createZKP.call(x, v, xG, {
            from: web3.eth.accounts[accounts_index]
        });
        var vG = [single_zkp[1], single_zkp[2], single_zkp[3]];

        web3.personal.unlockAccount(addr, password);

        // Lets make sure the ZKP is valid!
        var verifyres = cryptoAddr.verifyZKP.call(xG, single_zkp[0], vG, {
            from: web3.eth.accounts[accounts_index]
        });

        if (!verifyres) {
            alert("Problem with voting codes");
            return;
        }

        var res = anonymousvotingAddr.register.call(xG, vG, single_zkp[0], {
                from: web3.eth.accounts[accounts_index],
                value: 0
            });

        // Submit voting key to the network
        if (res) {
            anonymousvotingAddr.register.sendTransaction(xG, vG, single_zkp[0], {
                from: web3.eth.accounts[accounts_index],
                gas: 4200000,
                value: 0
            });

            //TODO: DUPLICATED CODE FROM CURRENTSTATE. Needs its own function.
            document.getElementById('registerbutton').setAttribute("hidden",true);
            document.getElementById("registrationprogress").removeAttribute("hidden");
            document.getElementById("submitvotingkey").removeAttribute("hidden");

        } else {
            alert("Registration failed... Problem could be your voting codes or that you have already registered");
        }
    }
    
    function createVoteButtons() {
    	var totalAnswers = anonymousvotingAddr.getTotalAnswers();
        var innerHtlm = "";
        for(var i=0;i<totalAnswers;i++) {
        	var answer = web3.toUtf8(anonymousvotingAddr.answerList(i));
        	innerHtlm+= "<input class='action-button' type='button' value='" + answer + "' onclick='vote(" + i + ");'>"
        }
        document.getElementById('do_vote').innerHTML = innerHtlm;
    }


    // User votes yes or no!
    function vote(choice) {
    	console.log(choice);
    	
        if (!addressChosen) {
            alert("Please unlock your Ethereum address");
            return;
        }

        // Lets make sure they are registered too...
        if (!anonymousvotingAddr.isRegistered(addr)) {
            alert("You are not registered for this vote");
            return;
        }
            // SETUP, SIGNUP, TALLY
        if (state == 0 || state == 1 || state == 3 ) {
            alert("You can only vote during the COMMITMENT or VOTE phase");
            return;
        }
        
        var personalPrivateKey;
        db.find({account: addr}, function(err, docs) {
        	if(err) {
        		alert("Error : " + err);
        	}
        	if (!docs.length) {
        		alert("Error : no account with this address " + addr + " found in the database!");
        		return;
        	} else if (docs.length>1) {
        		alert("Error : two or more accounts with this address " + addr + " found in the database!");
        		return;
        	} else {
        		web3.personal.unlockAccount(addr, password);
        		personalPrivateKey = docs[0].personalPrivateKey;
        		processVoting(personalPrivateKey, choice);
        	}
        });
        
        //setTimeout(processVoting, 5000, personalPrivateKey, choice);
        
    }
    
    function processVoting(personalPrivateKey, choice) {
    	
    	try {
	    	// Get xG and yG (only way to get values from a Struct)
	        var voter = anonymousvotingAddr.getVoterBis(addr);
			var adminPublicKeyStr_x = voter[3][0].toString(10);
			var adminPublicKeyStr_y = voter[3][1].toString(10);
	        var xG = [voter[4][0], voter[4][1]];
	        var yG = [voter[5][0], voter[5][1]];
			
			var adminPublicKey = [voter[3][0], voter[3][1]];
			var res = cryptoAddr.buildVotingPrivateKey.call(new BigNumber(personalPrivateKey), adminPublicKey);
	        console.log(res);
	        console.log(res[0].toString(10));
			
	        var x = res[0];
	        var _x = res[1][0];
	        var _y = res[1][1];

			
			//Check if the registeredKey is the same
			if(!_x.equals(xG[0]) || !_y.equals(xG[1])) {
				console.log(_x);
				console.log(xG[0]);
				console.log(_y);
				console.log(xG[1]);
				alert("Error : the registeredKey in the Smartcontract isnt equal of the calculated registeredKey");
				return;
			}
	        
	        
			//On initie la variable res1D
	        var w = new BigNumber(ec.genKeyPair().getPrivate().toString());
	        var totalVoter = anonymousvotingAddr.totalregistered();
	        var totalAnswers = anonymousvotingAddr.getTotalAnswers();
	        var res1D = [x,w,choice,totalAnswers,totalVoter];
	       
	    	//Init de res2D
	    	var res2D = [xG,yG];
	    	
	    	//On instancie les nombres aléatoires : il en faut totalAnswers-1 
	    	var diAndRiList = new Array();
	    	for(var i=0;i<totalAnswers-1;i++) {
	    		var di = new BigNumber(ec.genKeyPair().getPrivate().toString());
	    		var ri = new BigNumber(ec.genKeyPair().getPrivate().toString());
	    		diAndRiList.push([di,ri]);
	    	}
	    	 	
	    	var result = cryptoAddr.generateZKP.call(res1D, res2D, diAndRiList, {
                from: web3.eth.accounts[accounts_index]
            });  
	    	console.log(result);
	    	
			res1D = [totalAnswers, totalVoter];
			var y = result[0];
			var aList = result[1];
			var bList = result[2];
			var dAndrList = result[3];
			var resultVerif = cryptoAddr.verifyZKPVote.call(res1D, y, res2D, dAndrList, aList, bList, {
                from: web3.eth.accounts[accounts_index]
            });
			console.log(resultVerif);
	
	        // Let's make sure the zero knowledge proof checked out...
	        if (resultVerif[0]) {
	
	            var castvote = false;
	
	            // We either send a commitment to the vote, or the vote itself!
	            if (state == 2) {
	                if (confirm("You are voting " + web3.toUtf8(anonymousvotingAddr.answerList(choice)) + "... You will not be able to change your vote")) {
	                    castvote = true;
	                }
	                
	                if (castvote) {
	                    web3.personal.unlockAccount(addr, password);
	                    var res = anonymousvotingAddr.submitVote.call(y, dAndrList, aList, bList, {
	                        from: web3.eth.accounts[accounts_index]
	                    });
	                    
	                    if(res[0]) {
	                    	try {
	                    	anonymousvotingAddr.submitVote.sendTransaction(y, dAndrList, aList, bList, {
	                            from: web3.eth.accounts[accounts_index],
	                            gas: 9000000, 
	                            value: 0
	                        });
	                    	
	                        db.find({account: addr}, function(err, docs) {
	                        	console.log(docs);
	                        	if (docs.length) {
	                        		try {
	                        		db.update({account: addr}, {account: addr, personalPrivateKey: docs[0].personalPrivateKey, privateVotingKey: x.toString(10)}, {});
	                        		} catch(e) {
	                        			console.log(e);
	                        			alert(e);	                        			
	                        		}
	                        	}
	                        });
	                    	
	                    	document.getElementById('do_vote').innerHTML = 'Vote has been submitted... Waiting for confirmation';
	                    } catch (e) {
	                    	console.log(e);
	                    	alert("Error during the transaction of your vote");
	                    }
	                    } else {
	                    	alert(res[1]);
	                    }             
	                }
	            }
	        } else {
	        	console.log(resultVerif[1]);
	            alert(resultVerif[1]);
	        }
    	} catch(e) {
    		console.log(e);
    		alert(e);
    	}
    }

    function whatIsQuestion() {
        document.getElementById('question').innerHTML = anonymousvotingAddr.question();
        document.getElementById('question3').innerHTML = anonymousvotingAddr.question();
        document.getElementById('question4').innerHTML = anonymousvotingAddr.question();    
    }

    // Create the 'Registration Screen'. Mostly here to tidy up code.
    function createRegistrationField() {

      if(!changedToRegistration) {
        document.getElementById('registerready').removeAttribute("hidden");
        var date = new Date();
        date.setTime(anonymousvotingAddr.finishSignupPhase() * 1000);
        document.getElementById('registerby').innerHTML = "<hr><br>Register your ballot before " + clockformat(date);
        date.setTime(anonymousvotingAddr.endSignupPhase() * 1000);
        changedToRegistration = true;
      }

      // Have we submited the key yet?
      if(anonymousvotingAddr.isRegistered(addr)) {
        document.getElementById('registerbutton').setAttribute("hidden",true);
        document.getElementById("registrationprogress").removeAttribute("hidden");
        document.getElementById("submitregistration").removeAttribute("hidden");
      }

      document.getElementById('balance').innerHTML = web3.fromWei(web3.eth.getBalance(web3.eth.accounts[accounts_index]));

    }

    function currentState() {
		
    	
        if(!addressChosen) {
          return;
        }
        
        state = anonymousvotingAddr.state();

        whatIsQuestion();

        if (state == 0) {

        } else if (state == 1) {
            var time = anonymousvotingAddr.endSignupPhase() * 1000;
            var currentTime = new Date().getTime();
            document.getElementById('registerwait').setAttribute("hidden",true);
            if(currentTime > time) {
              document.getElementById("registerready").setAttribute("hidden", true);
              document.getElementById("resetbutton").removeAttribute("hidden");
              document.getElementById("regclock").innerHTML = clockformat(new Date(time));
              document.getElementById('registerby').setAttribute("hidden", true);
            } else {
              if(document.getElementById("resetbutton").hasAttribute("hidden")) {
                createRegistrationField();
              }
              if(anonymousvotingAddr.hasAskedForRegistration(addr)) {
                  document.getElementById('registerbutton').setAttribute("hidden",true);
                  document.getElementById('questionRegistration').setAttribute("hidden",true);
                  document.getElementById('inscriptionCode').setAttribute("hidden",true);
                  document.getElementById("registrationprogress").removeAttribute("hidden");
                  document.getElementById("submitregistration").removeAttribute("hidden");
            	  document.getElementById("submitregistration").innerHTML="Waiting for an administrator to confirm your registration.";
              }
              
              if(anonymousvotingAddr.isRegistered(addr)) {
                  document.getElementById('registerbutton').setAttribute("hidden",true);
                  document.getElementById('questionRegistration').setAttribute("hidden",true);
                  document.getElementById("registrationprogress").removeAttribute("hidden");
                  document.getElementById("submitregistration").removeAttribute("hidden");
                  document.getElementById("submitregistration").innerHTML="You are registered.<br>Please wait for the begin of the election.";
                }
            }

        } else if (state == 2) {
        	
          if(!changedToVote) {
            changedToVote = true;
            controlTransition(id_current_fs, "#votefs");
            createVoteButtons();
          }

          var time = anonymousvotingAddr.endVotingPhase() * 1000;
          var currentTime = new Date().getTime();
          var votebytimer = new Date(time);   
          
	      if(!anonymousvotingAddr.isRegistered(addr)) {
	            document.getElementById("do_vote").setAttribute("hidden", true);
	            document.getElementById("vote_waiting").setAttribute("hidden", true);
	            document.getElementById("resetbutton4").removeAttribute("hidden");
	            document.getElementById('voteby').setAttribute("hidden", true);
	            document.getElementById("resetbutton4").innerHTML = "You are not registered. You can't vote for this election.";
	      }

          if(currentTime > time) {
            document.getElementById("do_vote").setAttribute("hidden", true);
            document.getElementById("vote_waiting").setAttribute("hidden", true);
            document.getElementById("resetbutton4").removeAttribute("hidden");
            document.getElementById('voteby').setAttribute("hidden", true);

            if(!anonymousvotingAddr.hasCastVote(web3.eth.accounts[accounts_index])) {
              document.getElementById("resetbutton4").innerHTML = "You did not cast your encrypted vote in time. <br> Your deposit will not be returned.";
            }
            return;
          }

          var date = new Date();
          date.setTime(time);

          if(anonymousvotingAddr.hasCastVote(addr)) {
        	document.getElementById("voteby").removeAttribute("hidden");
            checkVoteCast();
            checkStatistics();
            return;
          } 


        } else if (state == 3) {
          if(!changedToTally) {
            changedToTally = true;;
            controlTransition(id_current_fs, "#tallyfs");
          }

            // Did everyone vote? Did we have voters registered?
            if((anonymousvotingAddr.totalregistered().eq(anonymousvotingAddr.totalvoted())) && !anonymousvotingAddr.totalregistered().eq(new BigNumber("0"))) {
                var totalAnswer = anonymousvotingAddr.getTotalAnswers();
                var innerHtml = "";
                for (var i=0;i<totalAnswer;i++) {
              	  var answer = web3.toUtf8(anonymousvotingAddr.answerList(i));
              	  var tallyAnswer = anonymousvotingAddr.finalTally(i);
              	  innerHtml+= "<p>" + answer + " : " + tallyAnswer + "<\p>";
                }
                document.getElementById("result").innerHTML = innerHtml;
            } else {
              document.getElementById('result').innerHTML = "Voting has been cancelled.";
            }

        } else {
            //document.getElementById('state').innerHTML = "Undocumented Phase: Something went wrong... ";
            alert("Undocumented Phase: Something went wrong... ");
        }

        // checkDeadlines();
        checkVoteCast();
        checkStatistics();

    }
    
    function createPrivateVotingKey(addressVoter, personalPrivateKey) {
        var voter = anonymousvotingAddr.getVoterBis(addr);

        var xG = [voter[4][0], voter[4][1]];
		var adminPublicKey = [voter[3][0], voter[3][1]];
		
		var res = cryptoAddr.buildVotingPrivateKey.call(new BigNumber(personalPrivateKey), adminPublicKey);
        console.log(res);

        var x = res[0];
        var _x = res[1][0];
        var _y = res[1][1];

		//Check if the registeredKey is the same
		if(!_x.equals(xG[0]) || !_y.equals(xG[1])) {
			console.log(_x);
			console.log(xG[0]);
			console.log(_y);
			console.log(xG[1]);
			alert("Error : the registeredKey in the Smartcontract isnt equal of the calculated registeredKey");
			return;
		} else {
			return x;
		}
			
    }
    
    function checkVote() {
    	
        db.find({account: addr}, function(err, docs) {
        	if(err) {
        		alert("Error : " + e);
        	}
        	if (!docs.length) {
        		alert("Error : no account with this address " + addr + " found in the database!");
        		return;
        	} else if (docs.length>1) {
        		alert("Error : two or more accounts with this address " + addr + " found in the database!");
        		return;
        	} else {
        		var x;
        		try {
        			x = new BigNumber(docs[0].privateVotingKey);
        		} catch (e) {
        			console.log(e);
        			var personalPrivateKey = docs[0].personalPrivateKey;
        			x = createPrivateVotingKey(addr, personalPrivateKey);
        		}
        		
                var voter = anonymousvotingAddr.getVoterBis(web3.eth.accounts[accounts_index]);
                var yG = [voter[5][0], voter[5][1]];
                var vote = [voter[6][0], voter[6]][1];
                
                var totalVotant = anonymousvotingAddr.totalregistered();
                var totalCandidat = anonymousvotingAddr.getTotalAnswers();
                
            	var res = cryptoAddr.checkVote(x,yG,vote, totalVotant, totalCandidat);
            	
            	if (res[0]) {
            		alert("Your vote is : " + web3.toUtf8(anonymousvotingAddr.answerList(res[2])));
            	} else {
            		alert(res[1]);
            	}
        	}
        });
    	
    }

    function checkStatistics() {

      var registered = anonymousvotingAddr.totalregistered();
      var voted = anonymousvotingAddr.totalvoted();

      document.getElementById("registrationprogress").innerHTML = registered + " voters have registered.";
      document.getElementById("vote_waiting").innerHTML = voted + "/" + registered + " votes have been cast.";
    }

    function checkVoteCast() {

        // Check if key has been submitted
        if (anonymousvotingAddr.isRegistered(addr)) {
            //document.getElementById('submitvotingkey').innerHTML = "Voting key has been accepted by Ethereum";
            //Check if vote has already been cast (or if a commitment has been accepted)
            if (anonymousvotingAddr.hasCastVote(addr)) {
                document.getElementById('do_vote').innerHTML = "Vote has been cast";
            }
        }


    }

    // Control which window opens....
    function controlTransition(currentfs, nextfs) {

      // Prevent weird loop
      if(currentfs == nextfs) {
        return;
      }
          
      // Do we know where to go next?
      if(nextfs != null) {
          nextSlide(currentfs, nextfs);
          return;
      }
      
      // Nope.. jump to latest state.
      var state = anonymousvotingAddr.state();
 
      switch(state.toString("10")) {
        case "0":
            nextSlide(currentfs, "#registerfs");
        	//alert("The election has not begun. Please wait.")
            break;
        case "1":
           nextSlide(currentfs, "#registerfs");
           break;
        case "2":
           $("#progressbar li").eq($("fieldset").index($("#registerfs"))).addClass("active");
           nextSlide(currentfs, "#votefs");
           break;
        case "3":
           $("#progressbar li").eq($("fieldset").index($("#registerfs"))).addClass("active");
           $("#progressbar li").eq($("fieldset").index($("#votefs"))).addClass("active");
           $("#progressbar li").eq($("fieldset").index($("#tallyfs"))).addClass("active");
           nextSlide(currentfs, "#tallyfs");
           break;
        default:
          break;
      }
    }

    // Easy to read clock time format.
    function clockformat(date) {
       var mins = "";

       if(date.getMinutes() < 10) {
         mins = "0" + date.getMinutes();
       } else {
         mins = date.getMinutes();
       }
       var toString = date.getHours() + ":" + mins + ", ";

       toString = toString + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();

       return toString;
    }
    
    whatIsQuestion();
    
    selectBox();

    /*
     * State Variables. Make sure we only do these things ONCE.
     */
    var addressChosen = false; // User has selected their Ethereum Address
    var uploaded = false; // User has uploaded their voting codes

    var changedToRegistration = false;
    var changedToVote = false;
    var changedToTally = false;
    
    try {
    	setInterval("currentState()", 5000);
    	currentState();
    } catch(e) {
    	conole.log(e);
    }

    /* FOR THE FIELD SET STEPPING */
    var current_fs, next_fs; //fieldsets
    var id_current_fs;
    var left, opacity, scale; //fieldset properties which we will animate
    var animating; //flag to prevent quick multi-click glitches

    function nextSlide(current_id, next_id) {
        if (animating) return false;
        animating = true;

        current_fs = $(current_id);
        next_fs = $(next_id);
        id_current_fs = next_id; // Added by paddy to get string id

        //activate next step on progressbar using the index of next_fs
        $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

        //show the next fieldset
        next_fs.show();
        //hide the current fieldset with style
        current_fs.animate({
            opacity: 0
        }, {
            step: function(now, mx) {
                //as the opacity of current_fs reduces to 0 - stored in "now"
                //1. scale current_fs down to 80%
                scale = 1 - (1 - now) * 0.2;
                //2. bring next_fs from the right(50%)
                left = (now * 50) + "%";
                //3. increase opacity of next_fs to 1 as it moves in
                opacity = 1 - now;
                current_fs.css({
                    'transform': 'scale(' + scale + ')'
                });
                next_fs.css({
                    'left': left,
                    'opacity': opacity
                });
            },
            duration: 800,
            complete: function() {
                current_fs.hide();
                animating = false;
            },
            //this comes from the custom easing plugin
            easing: 'easeInOutBack'
        });
    }

    $(".submit").click(function() {
        return false;
    });
    /* FOR THE OTHER TWEAKS */

    $("#uploadTrigger").click(function() {
        //console.log("Clicked2");
        $("#uploadFile").click();
    });

    //$("#triggerNext1").click(function() {
    //  console.log("Clicked2");
    // $("#done2").click();
    //});
