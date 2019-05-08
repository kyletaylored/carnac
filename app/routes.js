const fs = require('fs');
const db = require('./db_functions.js');
const getData = require('./get_functions.js');


// module.exports = (app, API_client, subreddits_db, posts_db, stored_posts_db) => {
	module.exports = (app, subreddits_db, posts_db, stored_posts_db) => {
	app.get('/', (req, res) => {
		
		
		// async function main() {
			
		// 	// The text to analyze
		// 	const text = 'Hello, world!';
		
		// 	const document = {
		// 		content: text,
		// 		type: 'PLAIN_TEXT',
		// 	};
		
		// 	// Detects the sentiment of the text
		// 	const [result] = await API_client.analyzeSentiment({document: document});
		// 	const sentiment = result.documentSentiment;
		
		// 	console.log(`Text: ${text}`);
		// 	console.log(`Sentiment score: ${sentiment.score}`);
		// 	console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
		// }
		
		// main().catch(console.error);
		
		if (fs.existsSync('./APIkey.txt')) {
			res.redirect('/dashboard');
			return;
		}
		else {
			res.redirect('/setup');
			return;
		}
	});

	app.get('/setup', (req, res) => {
				res.status(200);
				res.render('setup.hbs');
				return;
		});
	
	app.post('/setup', (req, res) => {
		let key = req.body.APIkey.trim();
		if (key == '') {
				res.status(500);
				res.render('setup.hbs', { message: 'Please enter your Google NLP API authentication key.'});
				return;
		}
		else {
			fs.writeFileSync('./APIkey.txt', key, function (err) {
				if(err) {
					console.log(err);
					return;
				}
			});
			res.redirect('/dashboard');
			return;
		}
	});

	app.get('/dashboard', (req, res) => {
		// // Removing all documents with the 'match-all' query
		posts_db.remove({}, { multi: true }, function (err, numRemoved) {
			console.log(numRemoved, 'posts dropped from post_db');
		
			subreddits_db.find({}, (err, docs) => {
				if (docs === undefined || docs.length == 0) {
					console.log('Redirecting to /add-subreddit');
					res.redirect('/add-subreddit');
					return;
				}
				else {
					// Concatinate subreddit names to form URL compatible string
					let multi_reddit = [];
					for (i = 0; i < docs.length; i++) {
						multi_reddit[i] = docs[i].subreddit;
					}
					multi_reddit = multi_reddit.join('+');
					
					

					// Gather post data using concatinated URL string
					getData.posts(multi_reddit)
					.then( (postDataArray) => {

						console.log('Storing postDataArray');
						// db.storePosts(posts_db, postDataArray);

						// insert all new posts into posts_db
						posts_db.insert(postDataArray, (err, newDocs) => {
							newDocs.forEach(function(d) {
								console.log('Saved post:', d.post_id);
							});
							//query stored_posts_db for saved IDs
							stored_posts_db.find({}, (err, storedDocs) => {
								if (err) {
									console.log (err);
									return;
								}
								else if(storedDocs === undefined || storedDocs.length == 0) {
									console.log('No stored posts');
									res.status(200);
									res.render('dashboard.hbs', {posts : newDocs});
									return;
								}
								else {
									//compare the post ID of newly grabbed posts to that of stored_posts_db
									newDocs.forEach( function (newID) {
										storedDocs.forEach( function (storedID) {
											// If the new post data matches a stored post ID and isn't marked saved, update posts_db to reflect the change
											if (newID.post_id == storedID.post_id && newID.saved == false) {
												posts_db.update({ post_id : newID.post_id}, { $set : { saved : true } }, {}, (err, numReplaced)  => {
													if(err){
														console.log(err);
														return;
													}
													console.log(numReplaced);
													
												});
											}
										});
									});
									// finally, sort all results of posts_db and sort by index value per document
									posts_db.find({}).sort({index : 1}).exec((err, finalDocs) => {
										console.log('Stored posts found');

										// render hbs file with final sorted list
										res.status(200);
										res.render('dashboard.hbs', {posts : finalDocs});
									});
								}
							});
						});
					}).catch(function(err) {
							if (err){
								console.log(err);
							} 
					});
				}
			});
		});
	});

	app.post('/dashboard', (req, res) => {
		res.redirect('dashboard.hsb');
		return;
	})

	app.get('/add-subreddit', (req, res) => {
		res.status(200);
		res.render('addsub.hbs');
	});

	app.post('/add-subreddit', (req, res) => {
		let input = req.body.subreddit.trim();
		if (input.length == 0) {
			res.status(500);
			res.render('addsub.hbs', { message: 'Please enter the name of a subreddit!' });
		}
		else {
			subreddits_db.find({subreddit : input}, (err, docs) => {
				if (docs === undefined || docs.length == 0) {
					try {
						// Insert document with subreddit name into subreddits_db database
							console.log('No results found for ', input);
							console.log('Storing ', input);
							db.storeSubreddit(subreddits_db, input);
						}
					catch(err) {
						// Print error on 
						console.log(err);
						// return_status = err;
					}
					res.status(200)
					res.render('addsub.hbs', { message: 'Subreddit has been added successfully!' });
				}
				else {
					res.render('addsub.hbs', {message : 'Subreddit has already been added' });
				}
			});
		}
	});

	app.post('/store-post', (req, res) => {
		let id = req.body.post_id
		console.log(id);

		posts_db.update({ post_id : id}, { $set : { saved : true } }, {}, (err, numReplaced)  => {
			if (err) {
				console.log(err);
				return;
			}
			posts_db.findOne({ post_id : id}, (err, doc) => {
				if (err){
					console.log(err);
					return;
				}
				// console.log('Results from findOne: ', doc);
				
				stored_posts_db.insert(doc, (err, newDoc) => {
					if (err) {
						console.log(err);
						return;
					}
					// console.log('Storing the following in stored_posts_db: ', newDoc);
				});
			});
		});
	});

	app.get('/stored-posts', (req, res) => {

		stored_posts_db.find({}, (err, docs) => {
			if (err) {
				console.log(err);
				return;
			}
			else if (docs.length == 0) {
				console.log('No posts have been saved');
				res.status(200);
				res.render('stored.hbs', { message: 'No posts have been saved.'});
				return;
			}
			else {
				res.status(200);
				res.render('stored.hbs', { posts: docs });
				return;
			}
		});
	});

	// app.get('/open-link/:permalink', (req, res) => {
	// 	let link = req.params.permalink;
	// 	let url = "https://www.reddit.com" + link;
	// 	console.log(req.params);
	// 	open(url);
	// });

	// app.get('/login', (req, res) => {
		
	//   res.status(200);
	//   res.render('login.hbs');
	// });

}
