/**
 * Controlador para el modulo relacionado con el pedido de reparaciones
 */
app.controller('marcasController', ['$scope', '$http', 'toastr', function ($scope, $http, toastr) {
    $scope.marcas = {};
    $scope.devices = [];
    $scope.tarjeta = {
        card_number: '',
        holder_name: '',
        expiration_year: '',
        expiration_month: '',
        cvv2: ''
    };
    $scope.reparacion = {
        total: 0.0,
        tarjeta: '',
        extrasD: [],
        reparacionD: [],
        img: ''
    };
    $scope.dev = 'marca';
    /**
     * 
     * @param {[[type]]} extra [[Description]]
     */
    $scope.agregarExtras = function (extra) {
        if ($scope.reparacion.extrasD.includes(extra)) {
            $scope.reparacion.extrasD = $scope.reparacion.extrasD.filter(function (el) {
                return el.id !== extra.id;
            })
        } else {
            $scope.reparacion.extrasD.push(extra);
        }
    }
    /**
     * 
     * @param {[[type]]} reparacion [[Description]]
     */
    $scope.agregarReparacion = function (reparacion) {
        if ($scope.reparacion.reparacionD.includes(reparacion)) {
            $scope.reparacion.reparacionD = $scope.reparacion.reparacionD.filter(function (el) {
                return el.id !== reparacion.id;
            })
        } else {
            $scope.reparacion.reparacionD.push(reparacion);
        }
        $scope.reparacion.total = calcularTotal($scope.reparacion.reparacionD);
        console.log($scope.reparacion);
    }
    /**
     * funcion con la cual se obtiene las marcas disponibles 
     */
    var obtenerMarcas = function () {
        var data = {};
        $http.get(API.endPoint + '/catdevice').then(function (result) {
            $scope.marcas = result.data;
            return data = result.data;
        }).catch(function (err) {
            toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
        });
    };
    obtenerMarcas();


    /**
     * funcion con la cual se entra al detalle de la marca donde contiene todos sus devices
     * @param {[[Array]]} device 
     */
    $scope.elegirDevice = function (marca) {
        $scope.dev = 'device';
        $scope.devices = marca.devices;
        localStorage.setItem('marca', JSON.stringify(marca));
    };

    /**
     * funcion donde se entra al detalle del device con el cual se muestran los extras
     * @param {[[type]]} device 
     */
    $scope.gregarExtras = function (device) {
        $scope.dev = 'extra';
        $scope.extras = device.extras;
        $scope.reparacion.img = device.img;
        localStorage.setItem('extras', JSON.stringify(device));
    };


    /**;
     *funcion para regresar al anterior
     */
    $scope.quitarDevice = function () {
        $scope.dev = 'marca';
        $scope.devices = [];
        localStorage.removeItem('marca');
    };

    /**
     * funcion con la cual se obtienen las reparaciones disponibles
     */
    $scope.obtenerReraciones = function () {
        localStorage.setItem('reparacion', JSON.stringify($scope.reparacion));
        $scope.reparaciones = [];
        $http.get(API.endPoint + '/Reparacion', {
            params: {
                device: JSON.parse(localStorage.getItem('extras')).id
            }
        }).then(function (result) {
            if (result.data.err) {
                toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
            }
            $scope.dev = 'reparacion';
            result.data.push({
                id: 0,
                price: 0,
                name: 'Otra reparación'
            });
            $scope.reparaciones = result.data;
        }).catch(function (err) {
            toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
        });
    };

    /**
     * funcion con la cual se obtiene la informacion de las tarjetas del usuario
     */
    $scope.obtenerTarjetas = function () {
        localStorage.setItem('reparacion', JSON.stringify($scope.reparacion));
        $scope.tarjetas = [];
        $http.get(API.endPoint + '/Tarjeta/getUserTarjetas/', {
            params: {
                id: JSON.parse(localStorage.getItem('user')).id
            }
        }).then(function (result) {
            if (result.data.err) {
                toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
            }
            console.log(result.data)
            $scope.dev = 'detail';
            $scope.tarjetas = result.data;
        }).catch(function (err) {
            toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
        });
    };
    /**
     * funcion con l cual se hace el calculo del precio
     * @param {[[type]]} reparacion [[Description]]
     * @return {[[Int]]} [[Description]]
     */
    function calcularTotal(reparacion) {
        return reparacion.reduce(function (b, e) {
            return parseInt(b) + parseInt(e.price);
        }, 0);
    }

    /**
     * Metodo con la cual se agrega la tarjeta de credito
     */
    $scope.agregarTarjeta = function () {
        if (validarDatosTarjeta($scope.tarjeta)) {
            OpenPay.token.create($scope.tarjeta, function (response) {
                var dataRequest = {
                    elputoid: JSON.parse(localStorage.getItem('user')).id,
                    token: response.token,
                    sess_id: API.sess_id
                }
                crearTarjeta(dataRequest);
            }, function (response) {
                toastr.error("Ha ocurrido un error al registrar su tarjeta intente mas tarde o ingrese otra tarjeta ", 'Error');
            });
        }
    }
    /**
     * metodo con el cual se crea la tarjeta de credito
     * @param {[[type]]} data [[Description]]
     */
    var crearTarjeta = function (data) {
        $http.post(API.endPoint + '/Tarjeta/crearTarjeta', data).then(function (result) {
            if (result.data.err) {
                toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
                return;
            }
            $scope.obtenerTarjetas();
            $scope.tarjeta = "";
            $('.modal').hide();
            toastr.success("Tarjeta agregada con exito", '');
        }).catch(function (err) {
            toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
        });
    }
    /**
     * funcion con la cual se valida los datos para  crear la tarjeta
     * @param {[[type]]} data [[Description]]
     * @return {[[type]]} [[Description]]
     */
    var validarDatosTarjeta = function (data) {
        if (!OpenPay.card.validateCardNumber(data.card_number)) {
            toastr.error('La tarjeta proporcionada es invalida', 'Error');
            return false;
        }
        if (!OpenPay.card.validateCVC(data.cvv2)) {
            toastr.error('El codigo de seguridad proporcionado es invalido', 'Error');
            return false;
        }
        if (!OpenPay.card.validateExpiry(data.expiration_month, data.expiration_year)) {
            toastr.error('El año o el mes de expiración son invalido', 'Error');
            return false;
        }

        return true;
    }
    /**
     * funcion con la cual se crea una reparacion
     */
    $scope.crearReparacion = function () {
        var dataRequest = {
            name: JSON.parse(localStrogre.getItem('user')).id,
            price: JSON.parse(localStorage.getItem('reparacion')).total,
            device: JSON.parse(localStorage.getItem('reparacion')).reparacionD.id
        }
        $http.post(API.endPoint + '/Reparacion', dataRequest).then(function (result) {
            if (result.data.err) {
                toastr.error('Ha ocurrido un error,favor de intentar mas tarde', 'Error');
            }
            $scope.marcas = {};
            $scope.devices = [];
            $scope.tarjeta = {
                card_number: '',
                holder_name: '',
                expiration_year: '',
                expiration_month: '',
                cvv2: ''
            };
            $scope.reparacion = {
                total: 0.0,
                tarjeta: '',
                extrasD: [],
                reparacionD: []
            };
            $scope.dev = 'marca';
            toastr.success('Reparación agregada con exito', '');
        }).catch(function (err) {
            toastr.error('Ha ocurrido un error,favor de intentar mas tarde', 'Error');
        });

    };
    /**
     * funcion con la cual se quita o 
     * @param {[[type]]} tarjeta [[Description]]
     */
    $scope.agregarTarjetas = function (tarjeta) {
        if ($scope.reparacion.tarjeta === tarjeta) {

        }
        $scope.reparacion.tarjeta = tarjeta;
    };

}]);
