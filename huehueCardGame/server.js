//variaveis da aplicação
var express = require("express");
var app = express();
var serv = require("http").Server(app);
var util = require('util');

//app.use(express.favicon());
app.use(express.static(__dirname + "/public"));

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
        //ROMS_LIST = Game.enterRoom(ROMS_LIST, data);
        data.location = '/game';
        var room = '123'
        SOCKET_LIST[data.challenger.id].join(room);
        SOCKET_LIST[data.challenged.id].join(room);
        console.log(data);

        setTimeout(function () {
            console.log("EMITI O GAMESTART");
            SOCKET_LIST[data.challenged.id].broadcast.to(room).emit('gameStart', data);
        }, 10000/25);
        
        

        //console.log(data);
        //var room = 'teste';
        //console.log('One : ' + data.challenger.id + ' two: ' + data.challenged.id);
        //SOCKET_LIST[data.challenger.id].join[room];
        //SOCKET_LIST[data.challenged.id].join[room];
        //console.log(SOCKET_LIST[data.challenger.id]);
        //socket.emit('GameStart', {room : data, location: '/game'});
    })
        
    socket.on('disconnect', function ()
    {
        PLAYER_LIST = Game.removePlayer(PLAYER_LIST, socket);
    });

    socket.on('joinRoom', function (data)
    {
        SOCKET_LIST[socket.id].join(data.room);
        PLAYER_LIST = Game.joinRoom(PLAYER_LIST, socket.id, data.room);
    });
});

//intervalo de emissão
setInterval(function ()
{
    for (var i in SOCKET_LIST)
    {
        var socket = SOCKET_LIST[i];
        socket.emit('players', PLAYER_LIST);
        socket.emit('rooms', ROMS_LIST);

        io.to('123').emit('teste', { um: 'um' });
    }

}, 10000/25)