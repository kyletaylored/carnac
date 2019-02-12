/* ------------------- Includes -------------------*/
const electron = require('electron');
const Datastore = require('nedb');
const url = require('url');
const path = require('path');
let getJSON = require('get-json');

/* ------------- Variables & Constants  ------------- */

// Expose electron classes
const {app, BrowserWindow, Menu, ipcMain} = electron;

// Global variable for main electron window
let mainWindow;


////////////////////////////////////////////
//////////Testing data store creation///////
// let users = new Datastore({ 
// 	filename: 'db/carnac-data-test.db', 
// 	autoload: true,
// 	onload: err => {
// 		if (err) {
// 			console.error('Error while loading the db!', err);
// 		}
// 	}
// });

/////////////////////////////////////////////
//////////Testing data insertion/////////////
// var scott = {  
// 	name: 'Scott',
// 	twitter: '@ScottWRobinson'
// };

// users.insert(scott, function(err, doc) {  
// 	console.log('Inserted', doc.name, 'with ID', doc._id);
// });

/////////////////////////////////////////////
//////////Testing data query/////////////////
// users.findOne({ twitter: '@ScottWRobinson' }, function(err, doc) {  
// 	console.log('Found user:', doc.name);
// });

/////////////////////////////////////////////
//////////Testing data deletion//////////////
// users.remove({ name: { $regex: /^Scott/ } }, function(err, numDeleted) {  
// 	console.log('Deleted', numDeleted, 'user(s)');
// });

/* ------------------ config ------------------ */

// Set ENV for production when ready
//process.env.NODE_ENV = 'production';


/* ------------------ { MAIN } ------------------ */

let db_subreddit = new Datastore({ 
	filename: 'db/subreddit.db', 
	autoload: true,
	onload: err => {
		if (err) {
			console.error('Error while loading the db!', err);
		}
	}
});

let db_metadata = new Datastore({ 
	filename: 'db/metadata.db', 
	autoload: true,
	onload: err => {
		if (err) {
			console.error('Error while loading the db!', err);
		}
	}
});

// Listen for the app to be ready
app.on('ready', () => {
	// Create main electron window
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		title: "CARNAC",
		show: false
	});
	// Quit app when closed
	mainWindow.on('closed', () => { 
		app.quit();
	});

	//Load html into window
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'html/index.html'),
		protocol:'file:',
		slashes: true
	}));


	// Wait for page contents to load before displaying electron window
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	});

	// Listen for page to be ready in mainWindow
	// ipcMain.on("mainWindowLoaded", () => {

	// });

	//Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);

});

// Handle create add window
function createAddWindow() {
	//Create new Browser
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add Subreddit'
	});

	//Load html into window
	addWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'html/addSubreddit.html'),
		protocol:'file:',
		slashes: true
	}));

	// Gargage collection handle
	addWindow.on('close', () => {
		addWindow = null;
	});
}

// // Template for Catching ipcMain item:add
// ipcMain.on('item:add', function(e, item){
// 	console.log(item);
// 	mainWindow.webContents.send('item:add', item);
// 	// addWindow.close();
// });

// Catch item:add using snoowrap
ipcMain.on('item:add', (e, sub) => {
	
	let newSub = {
		subreddit_name: sub
	}

	db_subreddit.insert(newSub, function(err, doc) {  
		console.log('Inserted', doc.subreddit_name, 'with ID', doc._id);
	});
	


	//////////USE LATER FOR COMMENT METADATA//////////////////
	// let request = 'https://www.reddit.com/r/' + sub + '.json';
	// getJSON(request)
    // .then(function(response) {

	// 	for (i = 0; i < response.data.children.length; i++) {
	// 		let postData = {
	// 			subreddit: response.data.children[i].data.subreddit,
	// 			selftext: response.data.children[i].data.selftext,
	// 			title: response.data.children[i].data.title,
	// 			score: response.data.children[i].data.score,
	// 			id: response.data.children[i].data.id
	// 		}
	// 		db_metadata.insert(postData, function(err, doc) {  
	// 			console.log('Inserted', doc.title, 'with ID', doc._id);
	// 		});
	// 		mainWindow.webContents.send('item:add', postData.title);
	// 	}
	// }).catch(function(error) {
    //   console.log(error);
    // });

	addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
	{
		label:'File',
		submenu:[
			{
				label: 'Add Item',
				click(){
					createAddWindow();
				}
			},
			{
				label: 'Clear Items',
				click(){
					mainWindow.webContents.send('item:clear');
				}
			},
			{
				label: 'Quit',
				accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
				click(){
					app.quit();
				}
			}
		]
	}];
	
// If mac, add empty object to menu
if (process.platform == 'darwin') {
	mainMenuTemplate.unshift({});
}

//Add developer tools item if not in production
if (process.env.NODE_ENV !== 'production') {
	mainMenuTemplate.push({
		label: 'Developer Tools',
		submenu:[
			{
				label: 'Toggle DevTools',
				accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
				click(item, focusedWindow){
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: 'reload'
			}
		]
	});
}
