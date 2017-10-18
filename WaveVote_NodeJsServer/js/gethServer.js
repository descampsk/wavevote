/**
 * http://usejsdoc.org/
 */
const { spawn } = require('child_process');
const bat = spawn('C:/Developpement/WaveVote/WaveVote_NodeJsServer/geth/geth.exe', ["--networkid=9876"]);

bat.stdout.on('data', (data) => {
  console.log(data.toString());
});

bat.stderr.on('data', (data) => {
  console.log(data.toString());
});

bat.on('exit', (code) => {
  console.log(`Child exited with code ${code}`);
});


var geth = require("geth");

console.log(process.env.LOCALAPPDATA);
const datadir = require('path').join(process.env.LOCALAPPDATA, '/Ethereum-9876');

var cp = require("child_process");
cp.spawn('C:/Developpement/WaveVote/WaveVote_NodeJsServer/geth/geth.exe', []);

var options = {
	    mine: null,
	    datadir: datadir,
	    geth_bin: 'C:\\Developpement\\WaveVote\\WaveVote_NodeJsServer\\geth\\geth.exe'
	};

var listener = {
	    stdout: function (data) {
	        process.stdout.write("I got a message!! " + data.toString());
	    },
	    stderr: function (data) {
	        if (data.toString().indexOf("Protocol Versions") > -1) {
	            geth.trigger(null, geth.proc);
	        }
	    },
	    close: function (code) {
	        console.log("It's game over, man!  Game over!");
	    }
	};

//geth.configure(options);
console.log("Configuration ok");
console.log(geth.bin);
console.log(geth.datadir);
	 
	geth.start(options, function (err, proc) {
	    if (err) return console.error(err);
	    // get your geth on!
	});