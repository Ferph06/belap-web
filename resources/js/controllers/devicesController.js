
app.controller('deviceController',['$scope', '$http' ,'toastr', function($scope, $http, toastr){
   

    let obtenerDevices = function(){
        let data={};
        $http.get(API.endPoint+'/device').then(function(result){
            console.log(result)
               $scope.devices=result.data;
        }).catch(function(err){
            toastr.error("!UUPS OCURRIO UN ERROR",'Error');
        });
    };
     obtenerDevices();
}]);