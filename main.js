/* ------------------- Includes -------------------*/
const electron = require('electron');
const url = require('url');
const path = require('path');
const snoowrap = require('snoowrap');
// const bodyParser = require('body-parser');
require('dotenv').config();

/* ------------- Variables & Constants  ------------- */
//let webApp = express();

const {app, BrowserWindow, Menu, ipcMain} = electron;
let r = new snoowrap({
	userAgent: 'reddit-bot-node',
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	username: process.env.REDDIT_USER,
	password: process.env.REDDIT_PASS
});

/* ------------------ config ------------------ */

// Set ENV
//process.env.NODE_ENV = 'production';

let mainWindow;


/* ------------------ { MAIN } ------------------ */

// Listen for the app to be ready
app.on('ready', function() {
	//Create new Browser
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 800,
		title: "CARNAC"
	});

	//Load html into window
	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'html/index.html'),
		protocol:'file:',
		slashes: true
	}));
	// Quit app when closed
	mainWindow.on('closed', function () { 
		app.quit();
	});
	//Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

// Handle create add window
function createAddWindow(){
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
	addWindow.on('close', function(){
		addWindow = null;
	});
}

// // Catch item:add
// ipcMain.on('item:add', function(e, item){
// 	console.log(item);
// 	mainWindow.webContents.send('item:add', item);
// 	// addWindow.close();
// });

// Catch item:add using snoowrap
ipcMain.on('item:add', function(e, item) {
	
	//Parse contents of POST request and extract subreddit name
	// let name = req.body.subreddit;
	//let count = parseInt(req.body.number, 10);

	let name = item;
	
	console.log(name);

	r.getSubreddit(name).getHot().map(post => post.title).then( (results) => {
		mainWindow.webContents.send('item:add', results);
	});

	// mainWindow.webContents.send('item:add', item);
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

// webApp.use(bodyParser.urlencoded({ extended: false }));
// webApp.post('/api/subreddit-info', (req, res) => {
	
// 	//Parse contetns of POST request and extract subreddit name
// 	let name = req.body.subreddit;
// 	let count = parseInt(req.body.number, 10);
	
// 	console.log(name);
// 	console.log(count);

// 	r.getSubreddit(name).getHot({limit: count}).map(post => post.title).then( (results) => {
// 		res.send(results);
// 	});

// });

// // Set server variable to listen on port 3000
// let server = webApp.listen(3000, () => {
// 	let port = server.address().port;
// 	console.log('Node Web Server started at http://localhost:%s', port);
// });
