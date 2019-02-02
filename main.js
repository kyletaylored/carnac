/* ------------------- Includes -------------------*/
const electron = require('electron');
const url = require('url');
const path = require('path');
const snoowrap = require('snoowrap');
const bodyParser = require('body-parser');
require('dotenv').config();

/* ------------- Variables & Constants  ------------- */
//let webApp = express();

const {app, BrowserWindow, Menu, icpMain} = electron;
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
	mainWindow = new BrowserWindow({});

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


webApp.use(bodyParser.urlencoded({ extended: false }));
webApp.post('/api/subreddit-info', (req, res) => {
	
	//Parse contetns of POST request and extract subreddit name
	let name = req.body.subreddit;
	let count = parseInt(req.body.number, 10);
	
	console.log(name);
	console.log(count);

	r.getSubreddit(name).getHot({limit: count}).map(post => post.title).then( (results) => {
		res.send(results);
	});

});

// Set server variable to listen on port 3000
let server = webApp.listen(3000, () => {
	let port = server.address().port;
	console.log('Node Web Server started at http://localhost:%s', port);
});
