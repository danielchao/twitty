var express = require('express');
var key = require('./key.js');
var app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

io.set('log level', 2);
var port = process.env.PORT || 3000
server.listen(port);

var hbs = require('hbs');
var Twit = require('twit'); 
var T = new Twit(key.twitterApi);
//var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ];
//var stream = T.stream('statuses/sample');
var stream = T.stream('statuses/sample');

io.sockets.on('connection', function(socket) {
    socket.on('relocate', function(loc) {
        loc = [loc.ia.b, loc.ea.b, loc.ia.d, loc.ea.d];
        stream = T.stream('statuses/filter', { locations: loc } );
        stream.on('tweet', function(tweet) {
            if (tweet.coordinates || tweet.place) {
                io.sockets.emit('tweet', tweet);
            }
        });
    });
    socket.on('disconnect', function() {
        stream.stop();
    });
    stream.on('disconnect', function(disconnectMessage) {
        console.log(disconnectMessage);
    });
});


app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());
app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res) {
    res.render('index');
});
