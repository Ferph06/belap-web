/**
 * Controlador para el modulo relacionado con el pedido de reparaciones
 */
'use strict';


app.controller('marcasController', ['$scope', '$http', 'toastr', function ($scope, $http, toastr) {

  $scope.l = false
  $scope.sess_id = OpenPay.deviceData.setup()

  $scope.marcas = {};
  $scope.devi = {
    name: '',
    extras: [],
    rep: []
  }
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
    img: '',
    adicionales: '',
    datos_recoleccion: {
      direccion: '',
      fecha: '',
      opcional: ''
    },
    selectedExtras: []
  }

  $scope.dev = 'marca'

  $scope.agregarExtras = function (extra) {
    if ($scope.reparacion.extrasD.includes(extra)) {
      $scope.reparacion.extrasD = $scope.reparacion.extrasD.filter(function (el) {
        return el.id !== extra.id;
      })
    } else {
      $scope.reparacion.extrasD.push(extra);
    }
  }

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

  var obtenerMarcas = function () {
    var data = {};
    $scope.l = true
    $http.get(API.endPoint + '/catdevice').then(function (result) {
      $scope.marcas = result.data;
      $scope.l = false
      return data = result.data;
    }).catch(function (err) {
      $scope.l = false
      toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
    });
  };
  obtenerMarcas();

  $scope.elegirDevice = function (marca) {
    $scope.dev = 'device';
    $scope.devices = marca.devices;
    $scope.selectedMarca = marca
    localStorage.setItem('marca', JSON.stringify(marca));
  }

  $scope.gregarExtras = function (device) {
    $scope.dev = 'extra';
    $scope.extras = device.extras;
    $scope.reparacion.img = device.img;
    $scope.selectedDevice = device
    localStorage.setItem('extras', JSON.stringify(device));
  };

  $scope.quitarDevice = function () {
    $scope.dev = 'marca';
    $scope.devices = [];
    localStorage.removeItem('marca');
  };

  $scope.obtenerReraciones = function () {
    localStorage.setItem('reparacion', JSON.stringify($scope.reparacion));
    $scope.reparaciones = [];
    $http.get(API.endPoint + '/Reparacion', {
      params: {
        device: JSON.parse(localStorage.getItem('extras')).id
      }
    }).then(function (result) {
      if (result.data.err) {
        console.log(result.data.err)
        toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
      }

      $scope.devi.name = '';
      $scope.devi.name = JSON.parse(localStorage.getItem('extras')).desc;
      $scope.dev = 'reparacion';

      $scope.reparaciones = result.data;
      cambiarEstado('primero');

    }).catch(function (err) {
      console.log(err);
      toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
    });
  };

  $scope.obtenerTarjetas = function () {
    localStorage.setItem('reparacion', JSON.stringify($scope.reparacion));
    $scope.devi.rep = $scope.reparacion.reparacionD;
    // $scope.dev.rep=;
    $scope.tarjetas = [];
    $http.get(API.endPoint + '/Tarjeta/getUserTarjetas/', {
      params: {
        id: JSON.parse(localStorage.getItem('user')).id
      }
    }).then(function (result) {
      if (result.data.err) {
        toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
      }
      $scope.dev = 'detail';
      cambiarEstado('segundo');
      $scope.tarjetas = result.data;
      console.log($scope.tarjetas);

    }).catch(function (err) {
      console.log(err);
      toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
    });
  };

  function calcularTotal(reparacion) {
    return reparacion.reduce(function (b, e) {
      return parseInt(b) + parseInt(e.price);
    }, 0);
  }

  $scope.agregarNuevaTarjeta = function (tarjeta) {
    $scope.reparacion.tarjeta = tarjeta;
    localStorage.setItem('reparacion', JSON.stringify($scope.reparacion))
  }

  $scope.agregarTarjeta = function () {
    if (validarDatosTarjeta($scope.tarjeta)) {
      $scope.l = true
      OpenPay.token.create($scope.tarjeta, function (response) {
        console.log('token', response);
        
        var dataRequest = {
          elputoid: JSON.parse(localStorage.getItem('user')).id,
          token: response.data.id,
          sess_id: API.sess_id
        }
        crearTarjeta(dataRequest);
      }, function (response) {
        $scope.l = false
        toastr.error("Ha ocurrido un error al registrar su tarjeta intente mas tarde o ingrese otra tarjeta ", 'Error');
      });
    }
  }

  var crearTarjeta = function (data) {
    $http.post(API.endPoint + '/Tarjeta/crearTarjeta', data).then(function (result) {

      if (result.data.err) {
        toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
        $scope.l = false
        return
      }

      console.log(result.data, data);
      
      
      $scope.obtenerTarjetas()
      $scope.tarjeta = ""

      toastr.success("Tarjeta agregada con exito", '');
      $('.modal').modal('hide')
      $scope.l = false

    }).catch(function (err) {
      toastr.error("!UUPS OCURRIO UN ERROR", 'Error');
      $scope.l = false
    });
  }

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

  $scope.crearReparacion = function () {

    $scope.l = true

    console.log($scope.device);


    $http.post(API.endPoint + '/servicio/pagarServicio', {
      card: $scope.reparacion.tarjeta,
      id: localStorage.getItem('uid'),
      sess_id: $scope.sess_id,
      total: $scope.reparacion.reparacionD.map(r => parseFloat(r.price)).reduce((a, b) => a + b),
      device: $scope.selectedDevice.id,
      notas: $scope.reparacion.adicionales,
      extras: $scope.extras.filter(e => e.checked),
      reps: $scope.reparacion.reparacionD,
      direccion: $scope.reparacion.datos_recoleccion.direccion,
      diaHora: $scope.reparacion.datos_recoleccion.fecha,
      instrucciones: $scope.reparacion.datos_recoleccion.opcional,
      newDate: $scope.reparacion.datos_recoleccion.newDate,
      newHour: $scope.reparacion.datos_recoleccion.newHour,
    }).then(data => {
      console.log(data)
      toastr.success('Pago realizado correctamente. Puedes checar el proceso de tu compra en la app de BeLap')
      $state.reload()
    }).catch(err => {
      console.log(err)
      toastr.error('Ocurrió un error al procesar tu compra...')
    })


  };

  var cambiarEstado = function (tipo) {
    switch (tipo) {
      case 'primero':
        document.querySelector('#stepU').classList.add('completed');
        document.querySelector('#stepU').classList.remove('activeStep')
        document.querySelector('#stepU').classList.add('defaultStep');
        document.querySelector('#stepD').classList.remove('defaultStep');
        document.querySelector('#stepD').classList.add('activeStep');
        break;

      case 'segundo':
        document.querySelector('#stepD').classList.add('completed');
        document.querySelector('#stepD').classList.remove('activeStep')
        document.querySelector('#stepD').classList.add('defaultStep');
        document.querySelector('#stepT').classList.remove('defaultStep');
        document.querySelector('#stepT').classList.add('activeStep');
        break;
      default:

        break;
    }
  }


}]);