const electron = require('electron');
const path = require('path');
const url = require('url');
const fm = require('easy-nodejs-app-settings');
// SET ENV
process.env.NODE_ENV = 'development';
const {
	app,
	BrowserWindow,
	Menu,
	ipcMain
} = electron;
const {
	SerialPort
} = require('serialport');

var counter = {}

var sp;

app.on('ready', function () {
	// Create new window
	mainWindow = new BrowserWindow({
		width: 1000,
		height: 500,
		title: 'Electon Example',
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: false,
			preload: path.join(__dirname, 'preload.js')
		}
	});

	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, 'public/index.html'),
			protocol: 'file:',
			slashes: true,
			title: 'Electron Example'
		})
	);

	// Quit app when closed
	mainWindow.on('closed', function () {
		app.quit();
	});

	mainWindow.on('minimize', function (event) {});

	mainWindow.on('restore', function (event) {});
	// Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	// Insert menu
	Menu.setApplicationMenu(mainMenu);
	mainWindow.toggleDevTools();
});

// Create menu template
const mainMenuTemplate = [
	// Each object is a dropdown
	{
		label: 'Application',
		submenu: [{
				label: 'About Application',
				selector: 'orderFrontStandardAboutPanel:'
			},
			{
				type: 'separator'
			},
			{
				label: 'Quit',
				accelerator: 'Command+Q',
				click: function () {
					app.quit();
				}
			}
		]
	},
	{
		label: 'Edit',
		submenu: [{
				label: 'Undo',
				accelerator: 'CmdOrCtrl+Z',
				selector: 'undo:'
			},
			{
				label: 'Redo',
				accelerator: 'Shift+CmdOrCtrl+Z',
				selector: 'redo:'
			},
			{
				type: 'separator'
			},
			{
				label: 'Test Function Call',
				accelerator: 'CmdOrCtrl+S',
				click: function () {
					testFunction();
				}
			},
			{
				type: 'separator'
			},
			{
				label: 'Cut',
				accelerator: 'CmdOrCtrl+X',
				selector: 'cut:'
			},
			{
				label: 'Copy',
				accelerator: 'CmdOrCtrl+C',
				selector: 'copy:'
			},
			{
				label: 'Paste',
				accelerator: 'CmdOrCtrl+V',
				selector: 'paste:'
			},
			{
				label: 'Select All',
				accelerator: 'CmdOrCtrl+A',
				selector: 'selectAll:'
			}
		]
	}
];

// If OSX, add empty object to menu
if (process.platform == 'darwin') {
	// mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu: [{
				role: 'reload'
			},
			{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			}
		]
	});
}

ipcMain.handle('TestEvent', async (event, data) => {
	console.log(data);
	return data;
});

var serialIndex = 0;
ipcMain.handle('emit_serial', async (event, data) => {
	serialIndex++;
	data = {
		"channel": data.channel,
		"data": data.data || {},
		"si": serialIndex
	}

	sp.write(JSON.stringify(data) + '\n')
	console.log("emit_serial", data);
	return data;
});


function handleSerialData(data) {
	mainWindow.send('TestEvent', i);
	switch (data.channel) {
		case "handshake":
			//console.log("handshake", data);
			break;
		case "getConfig":
			console.log("getConfig", data);
			window.config = data.data.config;
		default:
			break;
	}
}


// This is the Test Function that you can call from Menu
var i = 0;

function testFunction(params) {
	i++;
	console.log('You Click in Menu the Test Button i = ', i);
	mainWindow.send('TestEvent', i);
}



async function init() {
	var DataStore = new fm.File({
		appname: 'ElectronExample', // required
		file: 'DataStore.json', // required
		data: {}, // Optional, Set Data on Init only if the file is newly created or overwriteOnInit is true
		overwriteOnInit: false, // Optional, Set true if you want to overwrite the file on init. Attention the whole file will be overwritten!
		interval: 5000, // Optional, if not set the interval no File watcher will be created
		doLogging: false // Optional
	});


	var list = await SerialPort.list()
	//var dev = list[2]
	console.log("list", list);
	//console.log("dev", dev);

/* 	for (const device of list) {
		var dev = new SerialDevice(device.path)
	}
 */
	sp = new SerialPort({
		path: "COM7",
		baudRate: 9600
	})
	//console.log("serialport", sp);
	sp.on('open', () => {
		console.log('Serial Port Opened');
		//console.log(sp)
		var test = {
			"channel": "handshake"
		}

		sp.write(JSON.stringify(test) + '\n')
		//sp.write("hallo" + '\n')
	})
	sp.on('error', function (err) {
		console.log('Error: ', err.message);
	})

	sp.on('close', function () {
		console.log('Serial Port Closed');
	})

	sp.on('data', function (data) {
		try {
			//console.log('SerialPort data: ', data);
			jsonData = JSON.parse(data.toString());
			//console.log('Data: ', jsonData);
			
			handleSerialData(jsonData)
			mainWindow.send('serialdata', jsonData);
		} catch (error) {

		}
	})

	await DataStore.init();
	console.log('DataStore File Init Done! File path: ', DataStore.path);
	//console.log(DataStore.data);
}

/* class SerialDevice {
	constructor(path) {
		this.connected = false;
		this.path = path;
		this.sp = new SerialPort({
			path: path,
			baudRate: 9600
		})

		this.sp.on('open', () => {
			console.log(this.path , ' - Serial Port Opened');
			//console.log(sp)
			var test = {
				"channel": "handshake"
			}

			this.sp.write(JSON.stringify(test) + '\n')
			//sp.write("hallo" + '\n')
			var myInterval = setInterval(function (params) {
				this.connected = false;
				this.sp.close();
				console.log(this.path ,' - close setInterval');
				clearInterval(myInterval);
			}, 1000);
			
		})
		this.sp.on('error', function (err) {
			console.log(this.path , ' - Error: ', err.message);
			this.connected = false;
		})

		this.sp.on('close', function () {
			console.log(this.path , ' - Serial Port Closed');
			this.connected = false;
		})

		this.sp.on('data', function (data) {
			try {
				var string = data.toString().trim()

				console.log(this.path , ' - SerialPort Data: ', string);

				if (string == "") {
					return
				}
				
				var jsonData = JSON.parse(string);

				console.log('SerialPort data JSON: ', jsonData);

				if (jsonData.channel == 'handshake') {
					console.log('Serial Port handshake');
					this.connected = true;
				}


				handleSerialData(jsonData)
				mainWindow.send('serialdata', jsonData);
			} catch (error) {
				console.log('SerialPort data', error);
			}
		})
	}
}

 */

init();