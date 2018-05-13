/**
 * Controlador para gestionar el proceso de autencitación
 */
app.controller('loginController', ['$scope', '$http', 'toastr', '$auth', '$rootScope', '$state','$timeout', function ($scope, $http, toastr, $auth, $rootScope, $state,$timeout) {
    $scope.login = {
        email: '',
        password: ''
    };
    /**
     * funcion con la cual se hace el inicio de sesión con un usuario registrado desde la plataforma o la app
     */
    $scope.iniciarSesion = function () {
        if ($scope.login.email && $scope.login.password) {
            $http.post(API.endPoint + '/user/login', $scope.login).then(function (result) {
                if (result.data.err) {
                    toastr.error(result.data.err, 'Error');
                } else {
                    let user = result.data.user;
                    localStorage.setItem('token', result.data.token);
                    localStorage.setItem('user', JSON.stringify(user));
                    $timeout(function () {
                        $state.go('marcas');
                        $rootScope.user=user;
                        $rootScope.$apply();
                    }, 100);

                }
            }).catch(function (err) {
                console.log(err);
            });
        }
    };
    /**
     * funcion con la cual se hace el login con algun provedor
     * @param {[[String]]} provider [[Proovedor del servicio de autenticación]]
     */
    $scope.authenticate = function (provider) {
        $auth.authenticate(provider).then(function (ok) {
            $scope.fbLogin(ok)
        }).catch(function (err) {

console.log(err);
        });
    };
    
    $scope.fbLogin = function (token) {
        $http.post(API.endPoint + '/user/facebookApp', token).then(function (resp) {
            console.log(resp);
        }).catch(function (err) {
            console.log(er);
        });
    }
     $scope.$on('event:social-sign-in-success', (event, userDetails)=> {
		$scope.result = userDetails;
        console.log(userDetails);
		$scope.$apply();
	})
	$scope.$on('event:social-sign-out-success', function(event, userDetails){
		$scope.result = userDetails;
	})

}]);
