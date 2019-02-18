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

/* ---------------- { FUNCTIONS } --------------- */
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  mainWindow.loadFile('./html/index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  //Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);
}

// Handle create add window
function createAddWindow() {
	//Create new Browser
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		title: 'Add Subreddit'
	});


  // and load the index.html of the app.
  addWindow.loadFile('html/addSubreddit.html')
	//

	// Gargage collection handle
	addWindow.on('close', () => {
		addWindow = null;
	});
}
/* ------------------ { MAIN } ------------------ */

// Listen for the app to be ready
app.on('ready', createWindow);
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
})
app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


// // Template for Catching ipcMain item:add
// ipcMain.on('item:add', function(e, item){
// 	console.log(item);
// 	mainWindow.webContents.send('item:add', item);
// 	// addWindow.close();
// });

// Catch add:subreddit and store subreddit information
ipcMain.on('add:subreddit', (e, userInput) => {
	
  //create JSON object to prepare for insert
  let return_status;
  try {
      // Open subreddits.db database file

    let subreddit_db = db.open('subreddits');

    // Insert document with subreddit name into subreddit.db database
    db.storeSubreddit(subreddit_db, userInput);
  }
  catch(err) {
    // Print error on 
    console.log(err);
    return_status = err;
  }
  finally {
    mainWindow.webContents.send('add:subreddit', return_status);
  }
  
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
