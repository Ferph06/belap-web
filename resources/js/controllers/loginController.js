/**
 * Controlador para gestionar el proceso de autencitación
 */
app.controller('loginController',[ '$scope','$http','toastr','$auth', function($scope, $http,toastr,$auth) {
        $scope.login={
            email:'',
            password:''
        };
    /**
 * funcion con la cual se hace el inicio de sesión con un usuario registrado desde la plataforma o la app
 */
    $scope.iniciarSesion = function(){
        if($scope.login.email && $scope.login.password){
            $http.post(API.endPoint+'/user/login',$scope.login).then(function(result){
                if(result.data.err){
                    toastr.error(result.data.err, 'Error');
                   }else{
                       let  user=result.data.user;
                      localStorage.setItem('token',result.data.token);
                       localStorage.setItem('user',JSON.stringify(user));
                   }
            }).catch(function(err){
               console.log(err); 
            });
        }else{
            
        }   
    };
    /**
 * funcion con la cual se hace el login con algun provedor
 * @param {[[String]]} provider [[Proovedor del servicio de autenticación]]
 */
    $scope.authenticate = function(provider) {
       $auth.authenticate(provider).then(function(ok) {
        console.log(ok)
     }).catch(function(err) {
     });
    };

    
}]);