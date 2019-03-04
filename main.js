const electron = require('electron');
const url = require('url');
const path = require('path');
const mysql = require('mysql');
const db = require('./config/database');
var connection = mysql.createConnection(db.connection);
const exec = require('child_process').exec;
require('dotenv').config();

const {app, BrowserWindow, Menu} = electron;

let mainWindow;

function execute(command, callback) {
    exec(command, (error, stdout, stderr) => { 
        callback(stdout); 
    });
};
execute('node server.js', (output) => {
    console.log(output);
});
app.on('ready', function(){
    //create main window
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        title: "CARNAC - Reddit Trend Analyzer "
    });
    mainWindow.webPreferences = {
        nodeIntegration: true
    };
    //quit app on close
    mainWindow.on('closed', function(){
        app.quit();
    });
    
    //connects to mysql
    connection.connect(function(err, a){
        //throw error and quit app if connection fails
        if (err){
            app.quit();
            throw err;
        }

        //Load HTML into window
        mainWindow.loadURL(process.env.HOST + ":" + process.env.PORT + '/');    

        //wait for page contents to load before displaying electron window
        mainWindow.once('ready-to-show', function(){
            mainWindow.show();
        });

    });

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

    //insert menu
    Menu.setApplicationMenu(mainMenu);
});

//create menu template
const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Dashboard',
                click(){
                    mainWindow.loadURL(process.env.HOST + ":" + process.env.PORT + '/dashboard');
                    mainWindow.once('ready-to-show', function(){
                        mainWindow.show();
                    });
            
                }
            },
            {
                label: 'Login',
                click(){
                    mainWindow.loadURL(process.env.HOST + ":" + process.env.PORT + '/login');
                    mainWindow.once('ready-to-show', function(){
                        mainWindow.show();
                    });
            
                }
            },
            {
                label: 'Create New Account!',
                click(){
                    mainWindow.loadURL(process.env.HOST + ":" + process.env.PORT + '/signup');
                    mainWindow.once('ready-to-show', function(){
                        mainWindow.show();
                    });            
                }
            },
            {
                label: 'Sign out',
                click(){
                    mainWindow.loadURL(process.env.HOST + ":" + process.env.PORT + '/logout');
                    mainWindow.once('ready-to-show', function(){
                        mainWindow.show();
                    });            
                }
            },            
            {
                label: 'Exit',
                accelerator: process.platform = 'darwin' ? 'Command+Q' : 
                'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform == 'darwin'){
    mainMenuTemplate.unshift({});
}

//add developer tools if not in production mode
if (process.env.NODE_ENV !== 'production')
{
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label:'Open / Close',
                accelerator: process.platform = 'darwin' ? 'Command+I' : 
                'Ctrl+I',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}