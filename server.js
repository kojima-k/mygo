var express = require('express')
var app = express()
var path    = require("path");
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname+'/index.html'));
})

app.get('/mygo', function(req, res) {
    res.sendFile(path.join(__dirname+'/mygo.html'));
})

app.get('/navigator', function(req, res) {
    res.sendFile(path.join(__dirname+'/navigator.html'));
})

http.listen(3000, function() {
    console.log('example app listen on port 3000')
})

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('c2s-mygo-position', function(data) {
        console.log(data)
        io.emit('s2c-mygo-position', data)
    })

    socket.on('c2s-instruction', function(data) {
        console.log(data)
        io.emit('s2c-instruction', data)        
    })
});

app.use(express.static('public'));