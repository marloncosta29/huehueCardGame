var socket = io(); var players = {};
console.log(socket);
var list = document.getElementById('list');
var d = new Date();
var year = d.getFullYear(); 


var socket = socketConnect(document.getElementById('room').value);

function juntarSala() {
    socket.emit('joinRoom', { id: socket.id, room: document.getElementById('room').value });
    alert('Deu certo a room é ' + document.getElementById('room').value);
}

socket.on('testeRoom', function (data) {
    alert(data.msg);
});

socket.on('dadosSocket', function (data) {
    console.log(data);
    var id = document.getElementById('socketId');
    id.value = data;
})

socket.on('players', function (data) {
    console.log(data);
});