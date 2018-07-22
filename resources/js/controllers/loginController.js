/**
 * Controlador para gestionar el proceso de autencitación
 */
app.controller('loginController', ['$scope', '$http', 'toastr', '$auth', '$rootScope', '$state', '$timeout', function($scope, $http, toastr, $auth, $rootScope, $state, $timeout) {

  if ($rootScope.user) return $state.go('marcas')

  $scope.login = {
    email: '',
    password: ''
  };

  $scope.l = false

  $scope.iniciarSesion = function() {

    if ($scope.login.email && $scope.login.password) {

      $scope.l = true

      $http.post(API.endPoint + '/user/login', $scope.login).then(function(result) {
        if (result.data.err) {
          toastr.error(result.data.err, 'Error');
          $scope.l = false
        } else {
          let user = result.data.user;
          localStorage.setItem('token', result.data.token);
          localStorage.setItem('user', JSON.stringify(user));
          localStorage.setItem('uid', user.id)
          $timeout(function() {
            $state.go('marcas');
            $rootScope.user = user;
            $rootScope.$apply();
            $scope.l = false
          }, 100);

        }
      }).catch(function(err) {
        console.log(err);
      });
    }

  };

  /**
   * funcion con la cual se hace el login con algun provedor
   * @param {[[String]]} provider [[Proovedor del servicio de autenticación]]
   */
  $scope.authenticate = function(provider) {

    $scope.l = true

    $auth.authenticate(provider).then(function(ok) {
      
      if (provider == 'facebook') {
        $scope.fbLogin(ok)
      } else if (provider == 'google') {
        $scope.gLogin(ok)
      }

    }).catch(function(err) {
      //toastr.error('Ocurrió un error al iniciar sesión con ' + provider)
      $scope.l = false
      console.log(err);
    });

  };

  $scope.fbLogin = function(token) {
    $http.post(API.endPoint + '/user/facebookApp', {token: token.access_token}).then(function(result) {
      console.log(result.data);
      toastr.success('Sesión iniciada correctamente con Facebook')
      let user = result.data.user;
      localStorage.setItem('token', result.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('uid', user.id)
      $timeout(function() {
        $state.go('marcas');
        $rootScope.user = user;
        $rootScope.$apply();
        $scope.l = false
      }, 100);
    }).catch(function(err) {
      toastr.error('Ocurrió un error al iniciar sesión con Facebook...')
      $scope.l = false
      console.log(er);
    });
  }

  $scope.gLogin = function(info) {
    console.log(info)
    if (info.err) toastr.error(info.err)
  }

  $scope.$on('event:social-sign-in-success', (event, userDetails) => {
    $scope.result = userDetails;
    console.log(userDetails);
    $scope.$apply();
  })
  $scope.$on('event:social-sign-out-success', function(event, userDetails) {
    $scope.result = userDetails;
  })

}]);
