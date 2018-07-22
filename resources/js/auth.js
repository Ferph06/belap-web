/**
 * Configuración de la autentificación con los proveedores de servicios
 */
app.config(function ($authProvider) {

  $authProvider.facebook({
    clientId: '905715452941959',
    responseType: 'token',
    url: '/api/v1/user/facebookApp',
  });

  $authProvider.google({
    clientId: '856844008808-9va22df10uv51qh1l82hvlorq3kut90b.apps.googleusercontent.com',
    url: '/api/v1/user/google',
  })

});