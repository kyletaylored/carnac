// /* ------------------- Includes -------------------*/
// var express = require("express");

// /* ------------- Variables & Constants  ------------- */
// var webApp = express();

// // Set root directory for page content
// webApp.use(express.static('public'));

// /* ------------------ config ------------------ */

// //# Custom css, js, and image paths
// webApp.use('/css', express.static(__dirname + '/public/css'));
// webApp.use('/js', express.static(__dirname + '/public/js'));
// webApp.use('/images', express.static(__dirname + '/public/images'));

// /* ------------------ { MAIN } ------------------ */

// // Setup server instance on port 3600
// var server = webApp.listen(8081, function(){
//     var port = server.address().port;
//     console.log("Express Server started at http://localhost:%s", port);
//   });

var express = require("express");

var app = express();

app.use(express.static(__dirname +'/public'));

//make way for some custom css, js and images
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/images', express.static(__dirname + '/public/images'));

var server = app.listen(5000, function(){
    var port = server.address().port;
    console.log("Server started at http://localhost:%s", port);
});
