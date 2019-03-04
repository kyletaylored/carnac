var request = require('request');
var bcrypt = require('bcrypt-nodejs');

module.exports = function(app, connection) {
 app.get('/', function(req, res){
    if (req.session.user){
        res.redirect('/dashboard');
        return;
     }
    res.render('login.hbs');
 });

 app.get('/login', function(req, res){
    if (req.session.user) {
       return res.redirect('/');
    }
    res.status(200);
  res.render('login.hbs')
 });


 app.post('/login', (req, res)=> {
    
    if(req.method =="POST"){
       var username = req.body.username;
       var password = req.body.password;
       
       if(username == '')
       {
          res.status(500);
          return res.render('login.hbs', {message: 'Please enter your Username !'})
       }
       if(password == ''){
          res.status(500);
          return res.render('login.hbs', { message: 'Please enter your Password !' })
       }
       if (!validateEmail(username)) {
          res.status(500);
          return res.render('login.hbs', { message: 'Please enter your Email !' })
       }
       
       connection.query('SELECT * from users WHERE email = ?',[username], 
         function(err, rows){
            if(err)
               return res.send('Error');
            if(!rows.length){
               return res.render('login.hbs', { message: 'No user Found' })
            }
            if(rows.length){
               
               if(!bcrypt.compareSync(password, rows[0].password)){
                  return res.render('login.hbs', {message: 'Wrong Password'})
               }
               
               req.session.user = rows[0];
               
               res.redirect('/');
            }
            else{
               
               res.render('login.hbs', { message:  'Wrong Credentials' });
            }
         }
       )
    }
 })

 

 app.get('/signup', function(req, res){
    if (req.session.user) {
       return res.redirect('/');
    }
  res.render('signup.hbs');
 });


 app.post('/signup', (req, res)=> {


   
   
   if(req.method ==="POST"){
      
      var fname = req.body.fname;
      var lname = req.body.lname;
      var email = req.body.email;
      var password = req.body.password;
      var dob = req.body.dob;
      var gender = req.body.gender;
      console.log(gender)
      

      if(fname =='' || lname=='' || email=='' || password =='' || dob == undefined || gender ==undefined){
         console.log(fname, lname, email, dob, gender);
         console.log('NULL');
         res.status(500);
         return res.render('signup.hbs', { message: 'Fields are missing!' });
         
      }
      if (!validateEmail(email)) {
         res.status(500);
         return res.render('signup.hbs', { message: 'Please Enter correct Email !' });
      }

      password = bcrypt.hashSync(password, null, null);
      connection.query("SELECT * FROM users WHERE email = ? ",
         [email], function (err, rows) {
            if (err)
               res.send('Error')
            if (rows.length>0) {
               console.log('Email alreday used')
               res.render('signup.hbs', { message:  'Email already used!'})
            } else {
               var insertQuery = "INSERT INTO users ( fname, lname, email, password, dob, gender) values (?, ?, ?, ?, ?, ?)";

               connection.query(insertQuery, [fname, lname, email, password, dob, gender],
                  function (err, rows) {
                     if(err)
                        return console.log(err);
                     console.log(rows, "rows")
                     
                     return res.redirect('/login')
                  });

               
            }
         });
      
   } 
 })

 

   app.get('/logout', function (req, res) {
      req.session.destroy(function (err) {
         if (err) {
            console.log(err);
         }
         else {
            res.redirect('/');
         }
      });

   }); 

   app.get('/dashboard', (req, res) => {
      if (!req.session.user)
         return res.redirect('/login')
      else{

         connection.query('SELECT * from posts', function(err, result){
            if(err)
               console.log(err);
            else{
               res.render('dashbaord.hbs', {posts: result});
               
            }
         })
         
      }
      
      
   });

   app.get('/add-subreddit', (req, res)=> {
      if(!req.session.user)
         return res.redirect('/login');
      res.render('addsub.hbs');
   });

   app.post('/add-subreddit', (req, res)=> {
      if(!req.session.user)
         return res.redirect('/login');
      var subreddit = req.body.subreddit;
      if(subreddit.length == 0)
      {
         res.status(500);
         return res.render('addsub.hbs', { message: 'Please Enter Correct subreddit!' })
      }
      var url = 'https://www.reddit.com/r/' + subreddit + '.json';
      request(url, function (err, response, html){
         if(!err){
            console.log(response.statusCode)
            if(response.statusCode==200)
            {
               var jsonData = response.body;
               
               var valuesJvascripttArray = JSON.parse(jsonData).data;
               
               
               
               var querySubreddit = 'INSERT INTO subreddits (subreddit , subreddit_name_prefixed, subreddit_subscribers, user_id) VALUES (?, ?, ?, ?) ';
               
               connection.query(querySubreddit, [valuesJvascripttArray.children[0].data.subreddit, valuesJvascripttArray.children[0].data.subreddit_name_prefixed, valuesJvascripttArray.children[0].data.subreddit_subscribers, req.session.user.id], function (err, result, fields) {
                  if (err) {
                     res.status(500);
                     return res.render('addsub.hbs', {message: 'This subreddit already exists or something wrong happened !'})
                  }
                  else {
                     
                     
                     var values = [];

                     for (let i = 0; i < valuesJvascripttArray.children.length; i++)
                        values.push([valuesJvascripttArray.children[i].data.title, valuesJvascripttArray.children[i].data.permalink, valuesJvascripttArray.children[i].data.num_comments, valuesJvascripttArray.children[i].data.link_flair_text, valuesJvascripttArray.children[i].data.score, result.insertId])
                     
                     var queryPost = 'INSERT INTO posts (title, permalink, num_comments, link_flair_text, score, subreddit_id) VALUES ? ';

                     connection.query(queryPost, [values], function(err, result){
                        res.status(200)
                        return res.render('addsub.hbs', { message: 'Subreddit has been added !'});
                     })
                     
                      
                  }
               });

               

                
               
               
            }
               
            else{
               console.log('Please Enter Correct subreddit!');
               res.status(500);
               return res.render('addsub.hbs', { message: 'Please Enter Correct subreddit!' })
               
            }
         }
         else{
            console.log('Error')
         }
         
      })


   });



   app.get('/stored-post/:id', (req, res)=>{
      var postId = req.params.id;
      
      var query = 'SELECT * FROM posts where id = ? ';
      connection.query(query, [postId], function(err, results){
         if(err)
            return console.log('Error');
         console.log(results[0].id)
         query = 'INSERT INTO storedposts (user_id, status, post_id) VALUES (?, ?, ?)';
         connection.query(query, [req.session.user.id, 4, results[0].id], function(err, result){
            if(err)
               return console.log(err)
            console.log(result)
         } )
         res.redirect('/dashboard');
      });
   });

   app.get('/stored-posts', (req, res)=>{
      if (!req.session.user)
         return res.redirect('/login')
      else {

         connection.query('SELECT * from storedposts where user_id = ? ',[req.session.user.id], function (err, result) {
            if (err)
               console.log(err);
            else {
               
               if(result.length>0){
                  var values = [];
                  for (let i = 0; i < result.length; i++)
                     values.push(result[i].post_id);
                  console.log(values);

                  connection.query('SELECT * FROM posts where id IN (?) ', [values], function (err, result) {
                     if (err)
                        return console.log(err);
                     else {
                        console.log(result)
                        res.render('stored.hbs', { posts: result })
                     }
                  })
               }
               else{
                  res.render('dashbaord.hbs')
               }
               

            }
         })

      }
   })
};



function validateEmail(email) {
   var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
   return re.test(String(email).toLowerCase());
}