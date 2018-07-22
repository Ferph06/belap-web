/**
 * Configuracion de las rutas
 */
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('login');

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: './pages/login.html',
        controller: 'loginController'
    }).state('registro', {
        url: '/registro',
        templateUrl: './pages/registro.html',
        controller: 'registroController'
    }).state('marcas', {
        url: '/marcas',
        templateUrl: './pages/private/marcas.html',
        controller: 'marcasController',
        resolve: {
            security: ['$q', function ($q) {
                var booleano = JSON.parse(localStorage.getItem('user')) === undefined || JSON.parse(localStorage.getItem('user')) === null;
                console.log(booleano)
                if (booleano) {
                    return $q.reject('');
                }
            }]
        }
    }).state('devices', {
        url: '/devices',
        templateUrl: './pages/private/devices.html',
        controller: 'deviceController',
        resolve: {
            security: ['$q', function ($q) {
                console.log(booleano)
                var booleano = JSON.parse(localStorage.getItem('user')) === undefined || JSON.parse(localStorage.getItem('user')) === null;
                if (booleano) {
                    return $q.reject('');
                }
            }]
        }
    });

});
