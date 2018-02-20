//////////////////////////////////////////////////////////////////////
// Server - configuration or ExpreesJS
////////////////////// 
var express = require('express');
var bodyParser = require('body-parser');
var OAuthServer = require('express-oauth-server');

//////////////////////////////////////////////////////////////////////
// General config
//////////////////////
// create express app
var app = express();

// adding server authorization 
app.oauth = new OAuthServer({
  model: require('./src/models/teacher.model.js'), // See https://github.com/oauthjs/node-oauth2-server for specification 
});

// to avoid sending headers twice
app.use(function(req,res,next){
    var _send = res.send;
    var sent = false;
    res.send = function(data){
        if(sent) return;
        _send.bind(res)(data);
        sent = true;
    };
    next();
});

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

// adding authorization
app.use(app.oauth.authorize());
app.use(function(req, res) {
  res.send('Secret area');
});

//////////////////////////////////////////////////////////////////////
// Configuring the database
///////////////////////////
var dbConfig = require('./config/database.config.js');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {});

mongoose.connection.on('error', function() {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

mongoose.connection.once('open', function() {
    console.log("Successfully connected to the database");
})

//////////////////////////////////////////////////////////////////////
// Routing
//////////
// Require Teachers routes
require('./src/routes/teacher.routes.js')(app);


// listen for requests
app.listen(3000, function(){
    console.log("Server is listening on port 3000");
});

/////////////////////////////////////////////////////
// Auth - Managing Authorization and Authentication 
/////////////////////////////////////////////////////
const AuthController = require('./auth/auth.controller');
app.use('/api/auth', AuthController);

module.exports = app