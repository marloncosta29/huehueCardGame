//variaveis da aplicação
var express = require("express");
var app = express();
var serv = require("http").Server(app);
var util = require('util');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var load = require('express-load');
var mongoose = require('mongoose');
var flash = require('express-flash');
var moment = require('moment');
var expressValidator = require('express-validator');


app.use(express.static(__dirname + "/public"));
app.use(favicon(__dirname + '/huehueico.png'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(expressValidator());
app.use(cookieParser());
app.use(flash());


//Rota fixa para o main
app.get('*', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});

//execução do servidor Node e porta de conexão
var port = process.env.port || 1337;
var listener = serv.listen(port, function (req, res) {
    console.log('Server running on port: ' + listener.address().port);
});

//variaveis de controle do jogo
var SOCKET_LIST = {};
var PLAYER_LIST = {};
var ROMS_LIST = {};

//variaveis de jogo
var Player = require("./models/Player");
var Game = require("./models/Game");

var io = require("socket.io")(serv, {});

io.sockets.on("connection", function (socket) {

    socket.id = Math.random();
    SOCKET_LIST[socket.id] = socket;
    PLAYER_LIST = Game.enterPlayer(PLAYER_LIST, Player.onConnect(socket));

    socket.emit('player', PLAYER_LIST[socket.id]);

    socket.on('toChallenger', function (data) {
        socket.broadcast.emit('challenging', data);
    });

    socket.on('accept', function (data) {

        console.log('accept event');

        data.challenger.opponent = data.challenged.id;
        data.challenged.opponent = data.challenger.id;
        data.challenger.isPlaying = true;
        data.challenged.isPlaying = true;
        PLAYER_LIST[data.challenger.id].isPlaying = true;
        PLAYER_LIST[data.challenged.id].isPlaying = true;
        
        data.location = '/game';
        var room = '123'
        socket.join(room);

        //console.log(data);
        ROMS_LIST[data.id] = data;
        
        socket.emit('gameStart', data);
        socket.broadcast.emit('gameStart', data);

    })
        
    socket.on('disconnect', function ()
    {
        PLAYER_LIST = Game.removePlayer(PLAYER_LIST, socket);
    });
});

function gameStart()
{

    //io.to(room).emit('gameStart', data);
}


//intervalo de emissão
setInterval(function ()
{
    for (var i in SOCKET_LIST)
    {
        var socket = SOCKET_LIST[i];
        socket.emit('players', PLAYER_LIST);
        socket.emit('rooms', ROMS_LIST);
    }
}, 10000/25)