const electron = require('electron')
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

const isProd = () => process.env.NODE_ENV === 'production';
const directory = isProd() ? 'resources/app' : './';

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
  
   mainWindow.openDevTools();

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

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



const { spawn } = require('child_process');
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
console.log(process.env.APPDATA);
const datadir = path.join(process.env.APPDATA, '/Ethereum-9876');
const gethPath = path.join(__dirname, '../geth/geth.exe');
const genesisPath = path.join(__dirname, '../geth/genesis.json');
console.log(gethPath);

var geth=null;
function launchGeth() {
	geth = spawn(gethPath,
			  ["--networkid", "9876", "--rpc", "--rpcapi" , "db,eth,net,web3,personal",
				  "--rpcaddr", "0.0.0.0", "--datadir", datadir]);//, "--mine",
				  //"--etherbase", "0x0000000000000000000000000000000000000001"]);

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

//If no database exists, then we init the Blockchain with the genesis file
var fs = require('fs');
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
	  var fsExtra = require('fs-extra');
	  fsExtra.copySync(path.join(__dirname,'../geth/static-nodes.json'), path.join(datadir,'/static-nodes.json'));
	  //fs.createReadStream(path.join(__dirname, '../geth/static-nodes.json'))
	  //			.pipe(fs.createWriteStream(path.join(datadir,'/static-nodes.json')));
	  
	  launchGeth();
	});
} else {
	launchGeth();
}

//Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
    geth.kill("SIGINT");
  }
});