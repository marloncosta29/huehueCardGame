angular.module('app', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        $routeProvider
            .when('/', {
                templateUrl: 'partials/home.html',
            })
            .when('/perfil', {
                templateUrl: 'partials/perfil.html',
            })
            .when('/perfil/game', {
                templateUrl: 'partials/game.html',
            })
            .when('/contact', {
                templateUrl: 'partials/contact.html',
            })
            .when('/game', {
                templateUrl: 'partials/game.html'
            })
            .otherwise({ redirectTo: '/' });
});

angular.module('app').controller('perfilController', function ($scope) {
       
});

angular.module('app').controller('socket', function ($scope, $location) {
    var socket = io.connect();
    $scope.users = [];
    $scope.player = null;
    $scope.teste = 'ainda sou texto';

    socket.on('players', data => {
        $scope.$apply(() => $scope.users = data);

    });
    socket.on('GameStart', function (data) {
    });

    socket.on('player', function (data) {
        $scope.player = data;
    });

    //Challenger events
    $scope.toChallenger = function (user, player) {
        socket.emit('toChallenger', { challenger: player, challenged: user, challengeAccepted: false });
    }
   
    socket.on('challenging', function (data) {
        
        if (data.challenged.id === $scope.player.id)
        {
            //alert(data.challenger.id);
            var accept = confirm('O ' + data.challenger.id + ' te desafia, vode aceita?');
            data.challengeAccepted = true;
            //alert('Alert: ' + data.challengeAccepted);
            socket.emit('accept', data);
        }
    });

    socket.on('GameStart', function (data) {
        $location.path(data.location);
    });
    $scope.room = function () {
        alert('entrei no teste');
        socket.on('teste', function (data) {
            alert('TESTE' + data.roomTest);
        }); 
    }
});