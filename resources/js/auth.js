/**
 * Configuración de la autentificación con los proveedores de servicios
 */
app.config(function ($authProvider) {
    $authProvider.httpInterceptor = function () {
            return true;
        },
    $authProvider.withCredentials = false;
    $authProvider.tokenRoot = null;
    
    $authProvider.facebook({
        clientId: '1689177774454452',
        responseType: 'token'
    });
    $authProvider.google({
        clientId: '408273263196-677ms8qe5lol30prqbgrkggg50k0o3k3.apps.googleusercontent.com'
    });
    // Facebook
    $authProvider.facebook({
        name: 'facebook',
        url: '/user/facebookApp',
        authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
         
        requiredUrlParams: ['display', 'scope'],
        scope: ['email'],
        scopeDelimiter: ',',
        display: 'popup',
        oauthType: '2.0',
        popupOptions: {
            width: 580,
            height: 400
        }
    });

    // Google
    $authProvider.google({
        url: '/user/googleApp',
        authorizationEndpoint: 'https://accounts.google.com/o/oauth2/auth',
        requiredUrlParams: ['scope'],
        optionalUrlParams: ['display'],
        scope: ['profile', 'email'],
        scopePrefix: 'openid',
        scopeDelimiter: ' ',
        display: 'popup',
        oauthType: '2.0',
        popupOptions: {
            width: 580,
            height: 400
        }
    });
});
