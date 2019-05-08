let electron = require('electron');
let spawn = require('child_process').spawn;
require('dotenv').config();
require('./server.js');

// Setup and launch electon UI
const {app, BrowserWindow, Menu} = electron;
let mainWindow;

app.on('ready', function() {
  //create main window
  mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      title: "CARNAC - Reddit Trend Analyzer",
      show: false
  });
  mainWindow.webPreferences = {
      nodeIntegration: false
  };
  
  //Load HTML into window
  mainWindow.loadURL(process.env.HOST + ":" + process.env.PORT + '/');    

  //wait for page contents to load before displaying electron window
  mainWindow.once('ready-to-show', function(){
      mainWindow.show();
  });

  //quit app on close
  mainWindow.on('closed', function(){ 
    app.quit();
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
              label: 'Set API Key',
              click(){
                  mainWindow.loadURL(process.env.HOST + ":" + process.env.PORT + '/setup');
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
