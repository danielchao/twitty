var express = require('express');
var key = require('./key.js');
var app = express()
    , server = require('http').createServer(app)
    , io = require('socket.io').listen(server);

io.set('log level', 2);
server.listen(3000);

var hbs = require('hbs');
var Twit = require('twit'); 
var T = new Twit(key.twitterApi);
//var sanFrancisco = [ '-122.75', '36.8', '-121.75', '37.8' ];
//var stream = T.stream('statuses/sample');

io.sockets.on('connection', function(socket) {
    var stream = T.stream('statuses/sample');
    socket.on('relocate', function(loc) {
        loc = [loc.ia.b, loc.ea.b, loc.ia.d, loc.ea.d];
        stream.stop();
        stream = T.stream('statuses/filter', { locations: loc });
        stream.on('tweet', function(tweet) {
            socket.emit('tweet', tweet);
        });
    });
});


app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(express.bodyParser());
app.use(express.static(__dirname+'/public'));

app.get('/', function(req, res) {
    res.render('index');
});
