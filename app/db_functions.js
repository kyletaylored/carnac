// Import neDB module
// const Datastore = require('nedb');

module.exports = {
    // Function to insert into database
    insert: (db_object_instance, jsonObject ) => {
        // Insert object into specified database
        db_object_instance.insert(jsonObject, (err, doc) => {  
            if (err) {
                console.log(err);
            }
            // console.log('Inserted', doc.subreddit, 'of type', doc.type, 'document data with ID', doc._id);
        });
    },
    // Function to query database
    query: (db_object_instance, key, value) => {
        // Query database
        db_object_instance.find({key : value}, (err, docs) => {
            console.log('Found: ', docs);
        });

        /////////////////////////////////////////////
        //////////Example Structure//////////////////
        // db.findOne({ subreddit: '@ScottWRobinson' }, function(err, doc) {  
        // 	console.log('Found user:', doc.name);
        // });  

        // Probably return a value or JSON object so other functions can work with it
    },
    // Function to remove data from db
    delete: (db_object_instance, key, value) => {
        // Delete
        db_object_instance.remove({ }, (err, numDeleted) => {
            console.log(numDeleted, ' records deleted');
        });
    },
    // Store subreddit information into DB
    storeSubreddit: (db_object_instance, userInput) => {
        //create JSON object to prepare for insert
        let data = {
            subreddit: userInput
        }
        // Insert into db
        module.exports.insert(db_object_instance, data);
    },
    // Store post metadata into DB
    storePosts: (db_object_instance, jsonArray) => {
        // Iterate through jsonArray
        for (i in jsonArray) {
            // let id = jsonArray[i].post_id;
            // console.log(id);
            // // Maybe check before inserting to reduce duplicate data
            // db_object_instance.find({post_id : id}, (err, docs) => {
            //     if (err) {
            //         console.log(err);
            //     }
                
            //     if (docs === undefined || docs.length == 0) {
            //         // Insert into db
            //         console.log('Inserted ', docs.post_id, 'into posts_db');
            //     }
            //     else {
            //         console.log(id, 'is already stored');
            //     }
            // });
            module.exports.insert(db_object_instance, jsonArray[i]);

        }
    },
    // Store comments metadata into DB
    storeComments: (db_object_instance, jsonArray) => {
        // Open database with specified name and assign return object to variable "db"
        let db = module.exports.open('comments');
                    
        // Iterate through jsonArray
        for (i in jsonArray) {
            // Maybe check before inserting to reduce duplicate data

            // Insert into db
            module.exports.insert(db_object_instance, jsonArray[i]);
        }
    },
    getSubreddits: (db_object_instance) => {
        db_object_instance.find({}, (err, docs) => {
            return docs;
        });
    },
    getPosts: (db_object_instance) => {
        db_object_instance.find({}, (err, docs) => {
            return docs;
        });
    },
    getComments: (db_object_instance) => {
        db_object_instance.find({}, (err, docs) => {
            console.log("Query results: ", docs);
            return docs;
        });
    }
}




// let db_metadata = new Datastore({ 
// 	filename: 'db/metadata.db', 
// 	autoload: true,
// 	onload: err => {
// 		if (err) {
// 			console.error('Error while loading the db!', err);
// 		}
// 	}
// });


//  /**
//    * Return time since link was posted
//    * https://stackoverflow.com/a/3177838/477958
//   **/
//  function timeSince(date) {
//     var seconds = Math.floor(((new Date().getTime()/1000) - date))

//     var interval = Math.floor(seconds / 31536000);

//     if (interval >= 1) {
//       if(interval == 1) return interval + " year ago";
//       else 
//         return interval + " years ago";
//     }
//     interval = Math.floor(seconds / 2592000);
//     if (interval >= 1) {
//       if(interval == 1) return interval + " month ago";
//       else
//         return interval + " months ago";
//     }
//     interval = Math.floor(seconds / 86400);
//     if (interval >= 1) {
//       if(interval == 1) return interval + " day ago";
//       else
//         return interval + " days ago";
//     }
//     interval = Math.floor(seconds / 3600);
//     if (interval >= 1) {
//       if(interval == 1) return interval + " hour ago";
//       else
//         return interval + " hours ago";
//     }
//     interval = Math.floor(seconds / 60);
//     if (interval >= 1) {
//       if(interval == 1) return interval + " minute ago";
//       else
//         return interval + " minutes ago";
//     }
//     return Math.floor(seconds) + " seconds ago";
//   }