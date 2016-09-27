//Enter in the game
exports.enterPlayer = function (PLAYER_LIST, player)
{
    PLAYER_LIST[player.id] = player;
    return PLAYER_LIST;
}

//Remove from the game
exports.removePlayer = function (PLAYER_LIST, player)
{
    delete PLAYER_LIST[player.id];
    console.log('Player ' + player.id + ' was removed');
    return PLAYER_LIST;
}

//Enter in the room
exports.enterRoom = function (PlayerOne, PLayerTwo, ROMS_LIST)
{
    var BatleRoom =
    {
        id         : PlayerOne.id + PLayerTwo.id,
        Player_ONE : PlayerOne,
        Player_TWO : PLayerTwo,
        roomName   : PlayerOne.id + PLayerTwo.id
    }

    ROMS_LIST[PlayerOne.id + PLayerTwo.id] = BatleRoom;
    return ROMS_LIST;
}

//remove from the room
exports.romeveRoom = function (ROMS_LIST, BatleRoom)
{
    delete ROMS_LIST[BatleRoom.id]
    return ROMS_LIST;
}

//colocando uma sala ao jogador
exports.joinRoom = function (SOCKET_LIST, playerIdOne, playerIdTwo ,room)
{
    SOCKET_LIST[playerIdOne.id].join('room');
    SOCKET_LIST[playerIdTwo.id].join('room');
    console.log('Dados de teste join')
    console.log(SOCKET_LIST[playerIdOne.id].rooms);
    return SOCKET_LIST;
}
exports.UpdateList = function (PLAYER_LIST) {
    return PLAYER_LIST;
}