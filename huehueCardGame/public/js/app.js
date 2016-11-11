angular.module('app', ['ngRoute', "pubnub.angular.service"])

    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
        $islogado = function () {
            if (false) {
                return { templateUrl: 'partials/login.html' };
            } else {
                return { templateUrl: 'partials/perfil.html' };
            }
        }
        $routeProvider
            .when('/'        , {templateUrl: 'partials/home.html'     })
            .when('/perfil', $islogado())
            .when('/cadastro', {templateUrl: 'partials/cadastro.html' })
            .when('/contact' , {templateUrl: 'partials/contact.html'  })
            .when('/game'    , {templateUrl: 'partials/game.html'     , controller: 'gameController'})
            .otherwise({ redirectTo: '/' });
});

angular.module('app').controller('gameController', function ($scope) {
    var game = new Phaser.Game(700, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update });
    //cartas na mao
    var cardsHand = [{ PosX: 380, PosY: 380, card: null },
                     { PosX: 440, PosY: 380, card: null },
                     { PosX: 500, PosY: 380, card: null },
                     { PosX: 560, PosY: 380, card: null },
                     { PosX: 620, PosY: 380, card: null }];
    //cartas do campo do jogador
    var cardsOnField = [
        { PosX: 28, PosY: 280, ocupada: false},
        { PosX: 98, PosY: 280, ocupada: false},
        { PosX: 168, PosY: 280, ocupada: false},
        { PosX: 238, PosY: 280, ocupada: false},
        { PosX: 308, PosY: 280, ocupada: false}];

    //preload
    function preload() {
        game.load.image('campo', 'images/assets/BlateCamp.png');
        game.load.image('deck', 'images/assets/deck.png');
        game.load.image('card', 'images/assets/card.png');
    }
    //game create
    function create() {
        var bg = game.add.image(game.world.centerX, game.world.centerY, 'campo').anchor.set(0.5);
        var deck = game.add.sprite(630, 490, 'deck');
        deck.inputEnabled = true;
        deck.events.onInputDown.add(clickOnDeck, this);
        cardOnHand();

    }
    //Game update
    function update() {
        
    }

    //Mostra os cards na mão
    function cardOnHand()
    {
        for (var i = 0; i < cardsHand.length; i++) {
            cardsHand[i].card;
        }
    }
    //Ao clicar no deck o usuario cria uma carta na mão do jogador
    function clickOnDeck()
    {

        for (var i = 0; i < cardsHand.length; i++)
        {
            
            if (cardsHand[i].card == null)
            {
                cardsHand[i].card = game.add.sprite(cardsHand[i].PosX, cardsHand[i].PosY, 'card');
                cardsHand[i].card.inputEnabled = true;
                cardsHand[i].card.events.onInputDown.add(onClickCard, this);
                break;
            }
        }
    }
    //Ao clicar no card deve fazer algumas coisas
    function onClickCard(card) {
        //alert("cliquei na carta X:" + card.x + " Y:" + card.y);
        console.log(cardsOnField);
        for (var i = 0; i < cardsOnField.length; i++)
        {
            if (cardsOnField[i].ocupada == false)
            {
                card.x = cardsOnField[i].PosX;
                card.y = cardsOnField[i].PosY;
                cardsOnField[i].ocupada = true;
                break;
            }
            
        }
    }

});

angular.module('app').controller('appPubNub', [ '$scope', 'Pubnub', function ($scope, Pubnub) {

    $scope.uuid = Math.random(100).toString();
    $scope.channel = 'perfil'
    $scope.users = [];

    Pubnub.init({
        publish_key: 'pub-c-0821f8c7-f987-4c99-94a8-948bb5698fb5',
        subscribe_key: 'sub-c-72002f08-8b2e-11e6-a68c-0619f8945a4f',
        uuid: $scope.uuid
    });

    Pubnub.subscribe({
        channel: $scope.channel,
        triggerEvents: ['callback']
    });

    Pubnub.publish({
        channel: $scope.channel,
        message:
        {
            nome: 'user',
            id: Math.random(100) * 100, 
            age: 99,
            nivel: 'testeNivel'
        },
        callback: function (m) {
            console.log(m);
        } 
    })

    $scope.$on(Pubnub.getMessageEventNameFor($scope.channel), function (ngEvent, m) {
        $scope.$apply(function () {
            console.log(m);
            $scope.users.push(m);
        });
    });
    


}]);
angular.module('app').controller('socket', function ($scope, $location) {
    var socket = io.connect();
    $scope.users = [];
    $scope.rooms = [];
    $scope.player = null;
    $scope.data = null;
    $scope.teste = 'ainda sou texto';
    //players onlines
    socket.on('players', data => {
        $scope.$apply(() => $scope.users = data);
    });

    socket.on('rooms', data => {
        $scope.$apply(() => $scope.rooms = data);
    });

    socket.on('player', function (data) {
        $scope.player = data;
    });

    //Challenger events
    $scope.toChallenger = function (user, player) {
        socket.emit('toChallenger', { id: player.id + "" + user.id, challenger: player, challenged: user, challengeAccepted: false });
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

    socket.on('gameStart', function (data) {
        console.log(data);
        console.log(data.challenger.id);
        console.log(data.challenged.id);
        console.log(socket.id);
        if (data.challenged.id === $scope.player.id)
        {
            $scope.data = data;
            $location.path(data.location);
        }
        if (data.challenger.id === $scope.player.id)
        {
            $scope.data = data;
            $location.path(data.location);
        }
    });
});