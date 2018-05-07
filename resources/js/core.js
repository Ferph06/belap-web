const app = angular.module('belap', ['ui.router', 'ngAnimate', 'toastr', 'satellizer']);
const API = {
    endPoint: 'http://localhost:1337/api/v1',
    endPointProd: 'https://belap-dev.herokuapp.com/api/v1',
    sess_id:OpenPay.deviceData.setup()
}
app.run(function ($rootScope) {
    $rootScope.user = JSON.parse(localStorage.getItem('user'));
});