/* ------------------- Includes -------------------*/
const electron = require('electron');
const url = require('url');
const path = require('path');
const getJSON = require('get-json');
const db = require('./js/db_functions.js');
const get = require('./js/get_functions.js');

/* ------------- Variables & Constants  ------------- */

// Expose electron classes
const {app, BrowserWindow, Menu, ipcMain} = electron;

// Global variable for main electron window
let mainWindow;

/* ------------------ config ------------------ */

// Set ENV for production when ready
//process.env.NODE_ENV = 'production';

/* ------------------ { MAIN } ------------------ */

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
		mainWindow.show();
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

// Catch add:subreddit and store subreddit information
ipcMain.on('add:subreddit', (e, userInput) => {
	
	//create JSON object to prepare for insert
	let subreddit_db = db.open('subreddits');
  db.storeSubreddit(subreddit_db, userInput);
  
	// Close pop-up
	addWindow.close();

	// let subreddits = db.querySubreddits(subreddit_db);
	// console.log(subreddits);
	
	// // Fetch data and store it
	// // // Test getting data and storing in database
	// let post_db = db.open('posts');
	// try {
	// 	get.posts(userInput)
	// 	.then( (postDataArray) => {
	// 		console.log('Testing storeData');
	// 		db.storePosts(post_db, postDataArray);
	// 	}).catch(function(error) {
	// 			console.log(error);
	// 	});
	// } catch(error) {
	// 	console.log(error);
	// }
});

// Catch ipcMain get:subreddit and return
ipcMain.on('get:subreddit', (e, item) => {
	console.log(item);
	mainWindow.webContents.send('item:add', item);
	// addWindow.close();
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
