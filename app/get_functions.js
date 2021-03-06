const getJSON = require('get-json');

module.exports = {
    // Function to retreive subreddit metadata, return JSON object
    subreddit: async (subreddit_name) => {
        // Make JSON request using user-defined subreddit
        let url = 'https://www.reddit.com/r/' + subreddit_name + '.json';
        try {
            let response = await getJSON(url);
            let postDataArray = [];
        	for (i = 0; i < response.data.children.length; i++) {
                // Define JSON object for post data
                let postData = {
        			// subreddit: response.data.children[i].data.subreddit,
        			// selftext: response.data.children[i].data.selftext,
        			// title: response.data.children[i].data.title,
        			// score: response.data.children[i].data.score,
                    // id: response.data.children[i].data.id,
                    // type: 'subreddit'
        		}
                // Append post data to array
                postDataArray[i] = postData;
            }
            // Return JSON results as an array
            return postDataArray;
        } catch(error) {
            console.log(error);
        }
    },
    // Function to retreive post metadata, return JSON object
    posts: async (id) => {
        // Make JSON request using user-defined subreddit
        let url = 'https://www.reddit.com/r/' + id + '.json';
        try {
            let response = await getJSON(url);
            let postDataArray = [];
        	for (i = 0; i < response.data.children.length; i++) {
                // Define JSON object for post data
                let postData = {
        			subreddit: response.data.children[i].data.subreddit,
        			selftext: response.data.children[i].data.selftext,
                    title: response.data.children[i].data.title,
                    permalink: response.data.children[i].data.permalink,
                    link_flair_text: response.data.children[i].data.link_flair_text,
                    score: response.data.children[i].data.score,
                    subreddit_id: response.data.children[i].data.subreddit_id,
                    post_id: response.data.children[i].data.id,
                    index : i,
                    saved : false
        		}
                // Append post data to array
                postDataArray[i] = postData;
            }
            // Return JSON results as an array
            return postDataArray;
        } catch(error) {
            console.log(error);
        }

        
    },
    // Function to retreive comment metadata, return JSON object
    comments: async (id) => {
        
    }
}

    