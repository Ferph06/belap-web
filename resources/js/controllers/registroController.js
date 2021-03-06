/**
 * Controlador para el registro del usuario
 */
app.controller('registroController', ['$scope', '$http', 'toastr', '$state', function ($scope, $http, toastr, $state) {

  $scope.registro = {
    'name': '',
    'lastName': '',
    'email': '',
    'phone': '',
    'address': '',
    'password': '',
    'repassword': ''
  };

  $scope.l = false

  /**
   * funcion con la cual se hace el registro de los usuarios
   */
  $scope.registrarForm = function () {
    let datos = $scope.registro;
    $scope.l = true
    if (validarContrasena(datos.password, datos.repassword)) {
      $http.post(API.endPoint + '/user/register', datos).then(function (result) {
        if (result.data.err) {
          toastr.error(result.data.err, 'ERROR');
          $scope.l = false
        } else {
          toastr.success('Registro concluido exitosamente. Ahora puedes iniciar sesión', '');
          $scope.l = false
          $scope.registro = {
            'name': '',
            'lastName': '',
            'email': '',
            'phone': '',
            'address': '',
            'password': '',
            'repassword': ''
          };
          $state.go('login')
        }
      }).catch(function (err) {
        toastr.error('¡Ha ocurrido un error intentalo mas tarde!', 'Error');
        $scope.l = false
      })
    }
  };
  /**
   * funcion con la cual se valida que las contraseñas sean iguales
   * @param {[[type]]} password [[Description]]
   * @param {[[type]]} repassword [[Description]]
   * @return {[[Boolean]]} [[regresa un true en caso de que las contraseñas sean igual en caso contrario un false]]
   */
  let validarContrasena = function (password, repassword) {
    if (password !== repassword) {
      toastr.error('Las contraseñas no son iguales,favor de verificar', 'Error');
      return false;
    }
    return true;
  }


}]);