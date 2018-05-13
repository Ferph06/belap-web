const app = angular.module('belap', ['ui.router', 'ngAnimate', 'toastr', 'satellizer','socialLogin']);
/*const API = {
    endPoint: 'http://localhost:1337/api/v1',
    endPoint: 'https://belap-dev.herokuapp.com/api/v1',
    sess_id: OpenPay.deviceData.setup()
}*/
const API = {
    endPoint: 'https://belap-dev.herokuapp.com/api/v1',
    sess_id: OpenPay.deviceData.setup()
}
app.run(function ($rootScope,$state) {
    $rootScope.user = JSON.parse(localStorage.getItem('user'));
    
    $rootScope.cerrarSesion = function () {
       delete  $rootScope.user;
        localStorage.clear();
        $state.go('login');
    }
});
