const electron = require('electron')
const fs = require('fs');
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const winston = require('winston');
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

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../html/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  
  var debug = config.debug;
  if(debug) {
	  mainWindow.openDevTools();
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  
}




// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

process.on('uncaughtException', function (error) {
    // Handle the error
	winston.log('error',error)
	console.log(error);
});

var config = require(path.join(__dirname, "../config/config.json"));
console.log(config);
global.config = config;

const networkid = config.networkid;
const genesisPath = path.join(__dirname, '../geth/genesis.json');
const OS = process.env.OS;
console.log(process.env);

var gethPath;
var datadir;
if(OS==undefined) {
	gethPath = path.join(__dirname, '../geth/geth-win32-64.exe');
	datadir = path.join(process.env.HOME, '/Ethereum-' + networkid);
} else if(OS.indexOf("Windows")!=-1) {
	gethPath = path.join(__dirname, '../geth/geth-win32-64.exe');
	datadir = path.join(process.env.APPDATA, '/Ethereum-' + networkid);
} else {
	gethPath = path.join(__dirname, '../geth/geth-win32-64.exe');
	datadir = path.join(process.env.APPDATA, '/Ethereum-' + networkid);
}

const { spawn, exec } = require('child_process');
var geth=null;

function createStaticNodeFile() {
	var minerIp = config.minerIp;
	var minerEnode = config.minerEnode;
	var staticNodeFile = "[\n\t\"enode://" + minerEnode + "@" + minerIp + ":30303\"\n]";
	fs.writeFileSync(path.join(datadir,'/static-nodes.json'), staticNodeFile);
}

function launchGeth() {
	createStaticNodeFile();

	var mine = config.mine;
	var minerthreads = config.minerthreads;
	var lightNode = config.lightNode;
	var debug = config.debug;
	
	if(lightNode) {
		if(!debug) {
			var options = ["--light", "--networkid", networkid, "--rpc", "--rpcapi" , "db,eth,net,web3,personal",
				  "--rpcaddr", "0.0.0.0", "--datadir \"", datadir + '"'];
			geth = spawn(gethPath, options);
		} else {
			var optionStr = ' --light --networkid ' + networkid +
			' --rpc --rpcapi db,eth,net,web3,personal --rpcaddr 0.0.0.0 --datadir "' + datadir + '"';
			geth = exec('start /affinity 1 ' + gethPath + optionStr);
		}
	} else {
		if(mine) {
			var optionStr = ' --networkid ' + networkid + ' --rpc --rpcapi db,eth,net,web3,personal --rpcaddr 0.0.0.0 --datadir "' + datadir + '"'
							+ ' --mine --minerthreads ' + minerthreads + ' --etherbase 0x0000000000000000000000000000000000000001';
			geth = exec('start /affinity 1 ' + gethPath + optionStr);
		} else {
			if(!debug) {
				var options = ["--networkid", networkid, "--rpc", "--rpcapi" , "db,eth,net,web3,personal",
					  "--datadir \"", datadir + '"'];
				geth = spawn(gethPath, options);
			} else {
				var optionStr = ' --networkid ' + networkid +
				' --rpc --rpcapi db,eth,net,web3,personal --datadir "' + datadir + '"';
				console.log(optionStr);
				geth = exec('start /affinity 1 ' + gethPath + optionStr);
			}
		}
	}

	geth.stdout.on('data', (data) => {
	  console.log(data.toString());
	});

	geth.stderr.on('data', (data) => {
	  console.log(data.toString());
	});

	geth.on('exit', (code) => {
	  console.log(`Child exited with code ${code}`);
	});		
}

var externGeth = config.externGeth;
if(!externGeth) {
	//If no database exists, then we init the Blockchain with the genesis file
	if (!fs.existsSync(path.join(datadir, '/geth/chaindata'))) {
		const gethInit = spawn(gethPath,
				  ["init", genesisPath, "--datadir", datadir]);

		gethInit.stdout.on('data', (data) => {
		  console.log(data.toString());
		});

		gethInit.stderr.on('data', (data) => {
		  console.log(data.toString());
		});

		gethInit.on('exit', (code) => {
		  console.log(`Child exited with code ${code}`);
		  //We need to copy the static-nodes.json into the folder
		  //var fsExtra = require('fs-extra');
		  //fsExtra.copySync(path.join(__dirname,'../geth/static-nodes.json'), path.join(datadir,'/static-nodes.json'));
		  launchGeth();
		});
	} else {
		launchGeth();
	}
}

//Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
    if(geth!=null) {
        geth.kill("SIGINT"); 
    }
  }
});