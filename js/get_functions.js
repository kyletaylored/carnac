module.exports = {
    // Function to retreive subreddit metadata, return JSON object
    subreddit: (subreddit_name) => {
        const getJSON = require('get-json');
        //////////USE LATER FOR COMMENT METADATA//////////////////
        let request = 'https://www.reddit.com/r/' + subreddit_name + '.json';
        getJSON(request)
        .then(function(response) {

        	for (i = 0; i < response.data.children.length; i++) {
        		let postData = {
        			subreddit: response.data.children[i].data.subreddit,
        			selftext: response.data.children[i].data.selftext,
        			title: response.data.children[i].data.title,
        			score: response.data.children[i].data.score,
                    id: response.data.children[i].data.id,
                    type: 'subreddit'
        		}
        		db_metadata.insert(postData, function(err, doc) {  
        			console.log('Inserted', doc.title, 'with ID', doc._id);
        		});
        	}
        }).catch(function(error) {
          console.log(error);
        });
    },
    // Function to retreive post metadata, return JSON object
    posts: (id) => {
        const getJSON = require('get-json');
        let request = 'https://www.reddit.com/r/' + subreddit_name + '.json';
        getJSON(request)
        .then(function(response) {

        	for (i = 0; i < response.data.children.length; i++) {
        		let postData = {
        			subreddit: response.data.children[i].data.subreddit,
        			selftext: response.data.children[i].data.selftext,
        			title: response.data.children[i].data.title,
        			score: response.data.children[i].data.score,
                    id: response.data.children[i].data.id,
                    type: 'posts'
        		}
        		db_metadata.insert(postData, function(err, doc) {  
        			console.log('Inserted', doc.title, 'with ID', doc._id);
        		});
        	}
        }).catch(function(error) {
          console.log(error);
        });

    },
    // Function to retreive comment metadata, return JSON object
    comments: (id) => {
        const getJSON = require('get-json');
    }
}

    