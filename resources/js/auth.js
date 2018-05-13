/**
 * Configuración de la autentificación con los proveedores de servicios
 */
app.config(function ($authProvider,socialProvider) {
    //socialProvider.setGoogleKey("408273263196-677ms8qe5lol30prqbgrkggg50k0o3k3.apps.googleusercontent.com");
   
  socialProvider.setFbKey({appId: "1689177774454452", apiVersion: "v2.4"})
    $authProvider.httpInterceptor = function () {
            return true;
        };
        $authProvider.baseUrl =API.endPoint
    $authProvider.withCredentials = false;
    $authProvider.tokenRoot = null;
        $authProvider.baseUrl =API.endPointProd
    $authProvider.facebook({
        clientId: '1689177774454452',
        responseType: 'token'
    });
    $authProvider.google({
        clientId: '633437360795-vmg89oq6089pal6vchv0muac641d6uum.apps.googleusercontent.com'
    });
    // Facebook
    $authProvider.facebook({
        name: 'facebook',
        url: '/user/facebookApp',
        authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
        redirectUri: window.location.origin+'/',
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
        redirectUri: window.location.origin,
        optionalUrlParams: ['display'],
        scope: ['profile'],
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
