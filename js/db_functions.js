module.exports = {
    // Function to open database
    open: (db_name) => {
        // Import neDB module
        const Datastore = require('nedb');
        // Create database object 
        let db_object_instance = new Datastore({     
            filename: 'db/'+ db_name + '.db', 
            autoload: true,
            onload: err => {
                if (err) {
                    console.error('Error while loading the db!', err);
                }
            }
        });
        return db_object_instance;
    },
    // Function to insert into database
    insert: (db_object_instance, jsonObject ) => {
        // Insert object into specified database
        db_object_instance.insert(jsonObject, function(err, doc) {  
            console.log('Inserted', doc.subreddit, 'of type', doc.type, 'document data with ID', doc._id);
        });
    },
    // Function to query database
    query: (db_object_instance, key, value) => {
        // Query database


        /////////////////////////////////////////////
        //////////Example Structure//////////////////
        // db.findOne({ subreddit: '@ScottWRobinson' }, function(err, doc) {  
        // 	console.log('Found user:', doc.name);
        // });  

        // Probably return a value or JSON object so other functions can work with it
    },
    // Function to remove data from db
    remove: (key, value, db_object_instance) => {
        // Delete

        /////////////////////////////////////////////
        //////////Example Structure//////////////
        // users.remove({ name: { $regex: /^Scott/ } }, function(err, numDeleted) {  
        // 	console.log('Deleted', numDeleted, 'user(s)');
        // });
    },
    // Function to add subreddit to subreddit.db
    storeData: (jsonObject) => {
        // Determine the type of JSON data and store appropriately
        if (jsonObject.type == 'subreddit') {
            let db_name = 'subreddit';
            // Open database with specified name and assign return object to variable "db"
            let db = module.exports.open(db_name);
            // Insert into db
            module.exports.insert(db, jsonObject);
        } 
        else if (jsonObject.type == 'post') {
            let db_name = jsonObject.subreddit + '.posts';
            // Open database with specified name and assign return object to variable "db"
            let db = module.exports.open(db_name);
            // Insert into db
            module.exports.insert(db, jsonObject);
        }
        else if (jsonObject.type == 'comment') {
            let db_name = jsonObject.subreddit + '.comments';
            // Open database with specified name and assign return object to variable "db"
            let db = module.exports. open(db_name);
            // Insert into db
            module.exports.insert(db, jsonObject);
        }
        else { 
            console.log("Database insert failure: Invalid or missing jsonObject type!")
        }
        
        
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