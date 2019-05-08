// const exphbs = require('express-handlebars');
let express = require('express');
let exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
const Datastore = require('nedb');
// const language = require('@google-cloud/language');
  
// Instantiates a client
// const API_client = new language.LanguageServiceClient({      
// 		projectId: 'NLP-testing',
// 		keyFilename: './nlp-credentials.json',
// });

// Set up databases
let posts_db = new Datastore({
	filename: './db/posts.db',
	autoload: true,
	onload: err => {
		if (err) {
				console.error('Error while loading the post db!', err);
		} else {
			console.log('posts_db loaded successfully');
		}
	}
});

// let posts_db = new Datastore();
let subreddits_db = new Datastore({     
	filename: './db/subreddits.db', 
	autoload: true,
	onload: err => {
		if (err) {
				console.error('Error while loading the subreddit db!', err);
		} else {
			console.log('subreddit_db loaded successfully');
		}
	}
});

let stored_posts_db = new Datastore({     
	filename: './db/stored_posts.db', 
	autoload: true,
	onload: err => {
		if (err) {
				console.error('Error while loading the comment db!', err);
		} else {
			console.log('stored_posts_db loaded successfully');
		}
	}
});

let app = express();
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
	extended: true
 }));

// require('./app/routes.js')(app, API_client, subreddits_db, posts_db, stored_posts_db);
require('./app/routes.js')(app, subreddits_db, posts_db, stored_posts_db);

app.listen(3000);
console.log('Listening on port 3000');