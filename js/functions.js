const Datastore = require('nedb');

function addSubreddit(sub){
    //open db file
    let db_subreddit = new Datastore({     
        filename: 'db/subreddit.db', 
        autoload: true,
        onload: err => {
            if (err) {
                console.error('Error while loading the db!', err);
            }
        }
    });
    //create json object to prepare for insert
    let newSub = {
        subreddit_name: sub
    }
    //insert into db
    db_subreddit.insert(newSub, function(err, doc) {  
        console.log('Inserted', doc.subreddit_name, 'with ID', doc._id);
    });
}