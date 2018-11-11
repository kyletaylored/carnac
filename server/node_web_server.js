/* ------------------- Includes -------------------*/
const express = require("express");
const path = require('path');
const snoowrap = require('snoowrap');
const bodyParser = require('body-parser');
require('dotenv').config();

/* ------------- Variables & Constants  ------------- */
let webApp = express();
let r = new snoowrap({
	userAgent: 'reddit-bot-node',
	clientId: process.env.CLIENT_ID,
	clientSecret: process.env.CLIENT_SECRET,
	username: process.env.REDDIT_USER,
	password: process.env.REDDIT_PASS
});

/* ------------------ config ------------------ */

// Set root directory for page content
webApp.use(express.static(path.join(__dirname, '../client/public')));

//# Custom css, js, and image paths
webApp.use('/css', express.static(path.join(__dirname, '/public/css')));
webApp.use('/js', express.static(path.join(__dirname, '/public/js')));
webApp.use('/images', express.static(path.join(__dirname, '/public/images')));


/* ------------------ { MAIN } ------------------ */

// Basic get / route that probably doesn't need to be used.
// webApp.get('/', function (req, res) { 
// 	res.redirect('/index.html');
// });

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
let server = webApp.listen(3000, function(){
	let port = server.address().port;
	console.log("Node Web Server started at http://localhost:%s", port);
});
