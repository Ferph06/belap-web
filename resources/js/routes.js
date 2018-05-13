/**
 * Configuracion de las rutas
 */
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    
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
        controller: 'marcasController'
    }).state('devices', {
        url: '/devices',
        templateUrl: './pages/private/devices.html',
        controller: 'deviceController'
    });
});
