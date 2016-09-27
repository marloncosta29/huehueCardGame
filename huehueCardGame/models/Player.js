var Player = function (id)
{
    var self = {
        id: id,
        nome: "" + Math.floor(10 * Math.random()),
        age: 29,
        nivel: 'teletube',
        experience: 0,
        isPlaying: false,
        opponent: null
    }

    return self;
}
exports.onConnect = function (socket)
{
    var player = Player(socket.id);
    return player;
}


//var Player = function (id) {
//    var self = {
//        id:id,
//        nome: 'teste',
//        idade : 99
//    }
//    Player.list[id] = self;
//    return self;
//}
//Player.list = {};
//Player.onConnect = function (socket)
//{
//    var player = Player(socket.id);
//}
//Player.update = function ()
//{
//    var pack = [];
//    for (var i in Player.list)
//    {
//        var player = Player.list[i];
        //player.update();
//        pack.push({
//            nome: player.nome,
//            idade: player.idade
//        });
//    }

//    return pack;
//}

