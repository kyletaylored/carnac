var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
const exphbs = require('express-handlebars');
var mysql = require('mysql');

var flash = require('connect-flash');

var app = express();
var port = process.env.PORT || 8081;



var dbconfig = require('./config/database');
var connection = mysql.createConnection(dbconfig.connection);

connection.query('USE ' + dbconfig.database);





app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({
 extended: true
}));

//app.set('view engine', 'ejs');
app.engine('.hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));

app.use(session({
 secret: 'justasecret',
 resave:true,
 saveUninitialized: true
}));


app.use(flash());

require('./app/routes.js')(app, connection);



app.listen(port);
console.log("Port: " + port);