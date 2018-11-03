//Written by: Justin Stout
//Date: 10/31/2018
//Reference "package.json" for dependencies

// ----------------------- Includes -----------------------
require('dotenv').config();
const snoowrap = require('snoowrap');

//# May change to @google-cloud/language API
//const natural = require('natural');


// ---------------- Variables & Constants  ----------------
//#Create a snoowrap object with carnac_bot credentials
const r = new snoowrap({
    userAgent: 'reddit-bot-example-node',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});

let userstring; //list of user subreddits concatinated with + if multiple subreddits entered


//#Create a TfIdf object to analyze word frequency
//const tfidf = new natural.TfIdf();

//#Create natural object with credentials (In Progress)
// const n = new natural({

// });

// ----------------------- config -------------------------
//r.config({ proxies: false});

// -------------------- { FUNCTIONS } ---------------------



// function startNLP(titles) {
//     let post_title = titles;
//     console.log(post_title[0]);

//     for (let index = 0; index < post_title.length; index++) {
//         console.log(sentenceTokenizer.tokenize(post_title[index]));
//     }
//     //console.log(tokenizer.tokenize(titles));
//     return;
// };
// ----------------------- { MAIN } -----------------------

//#To use the function startNLP, include it in the "then" statment, otherwise use console.log in the "then" statement. 
//Example: 
//r.getHot().map(post => post.title).then(startNLP)

//#Get specific subreddit post titles
// r.getSubreddit('aww').getHot({limit: 10}).map(post => post.title).then(console.log);


// //#Printing a list of the titles on the carnac_bot "hot" page
// r.getHot({limit: 10}).map(post => post.title).then(console.log);

// //#Get multiple subreddit post titles
// r.getSubreddit('linux+funny').getHot({limit: 10}).map(post => post.title).then(console.log);

r.getSubreddit('linux').getHot({limit: 10}).map(post => post.title).then(console.log);
r.getSubreddit('funny').getHot({limit: 10}).map(post => post.title).then(console.log);

// //#Testing embedded function using Promises/Listings
// r.getHot({limit: 1000}).map(post => post.title).then(myListing => {
//     console.log(myListing.length);
//     console.log(myListing);
    
    
//     //then sendToNLP
// });





