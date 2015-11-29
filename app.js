var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session      = require('express-session');
var passport = require('passport');
var flash    = require('connect-flash');
//var favicon = require('static-favicon');

// Connect to DB
var dbConfig = require('./db');
mongoose.connect(dbConfig.url);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuring Passport
require('./passport/passport')(passport);

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());

require('./routes/routes.js')(app, passport);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


var sys = require('sys');
var net = require('net');
var mqtt = require('mqtt');

// create a socket object that listens on port 5000
var io = require('socket.io').listen(5000);

// create an mqtt client object and connect to the mqtt broker
var client = mqtt.connect('mqtt://broker.mqttdashboard.com');

io.sockets.on('connection', function (socket) {
  // socket connection indicates what mqtt topic to subscribe to in data.topic
  socket.on('subscribe', function (data) {
    console.log('Subscribing to '+data.topic);
    socket.join(data.topic);
    client.subscribe(data.topic);
  });
  // when socket connection publishes a message, forward that message
  // the the mqtt broker
  socket.on('publish', function (data) {
    console.log('Publishing to '+data.topic);
    client.publish(data.topic,data.payload);
  });
});

// listen to messages coming from the mqtt broker
client.on('message', function (topic, payload, packet) {
  console.log(topic+'='+payload);
  io.sockets.emit('mqtt',{'topic':String(topic),
    'payload':String(payload)});
});


module.exports = app;