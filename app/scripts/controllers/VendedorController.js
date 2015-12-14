angular.module('AngularScaffold.Controllers')
  .controller('VendedorController', ['$scope','$state', 'VendedorService','IngresoService', function ($scope,$state, VendedorService, IngresoService) {
  	$scope.title = "Facturación";
    $scope.linea_factura={};
    $scope.factura=[];
    $scope.producto={};
    $scope.search={};
    $scope.lf_cantidad=1;
    $scope.tot;

    $scope.goAdmin=function(){
      $state.go('admin');
    }

    $scope.addFactura=function(event){
      VendedorService.AddFactura($scope.search).then(function(response){
        if(event.which === 13) {
          if ($scope.search.id==0) {
            $('#efectuarMsg').modal('show');
          }else if($scope.search.id==-1){
            $scope.cancel();
          }else{
            $scope.producto = response.data[0];
            if ($scope.producto.cantidad<=1) {
              alert("Ya no tiene en el inventario");
            }else{
              $scope.existe=-1;
              $scope.tot=0;
              for(var i = 0; i < $scope.factura.length; i++) {
                if($scope.factura[i]['id'] === $scope.producto.id) {
                  $scope.existe=i;
                  break;
                }
              }
              if ($scope.existe==-1) {
                $scope.linea_factura = {
                  id : $scope.producto.id,
                  descripcion: $scope.producto.descripcion,
                  precio: $scope.producto.precio,
                  cantidad:1,
                  cantidadmax: $scope.producto.cantidad,
                  total: $scope.producto.precio*$scope.lf_cantidad
                }
                $scope.factura.push($scope.linea_factura);

                $scope.tot=0;
                for(var i = 0; i < $scope.factura.length; i++) {
                  $scope.tot+=$scope.factura[i]['total'];
                }
                $('#sub').val($scope.tot);
                $('#isv').val($scope.tot*0.15);
                $('#tot').val($scope.tot+($scope.tot*0.15));
              }else{
                $scope.temp=$scope.factura[$scope.existe]['cantidad'];
                if ($scope.temp<$scope.factura[$scope.existe]['cantidadmax']) {
                  $scope.factura[$scope.existe]['cantidad']++;
                  $('#'+$scope.existe).val($scope.temp+1);
                  $scope.factura[$scope.existe]['total']=$('#'+$scope.existe).val()*$scope.factura[$scope.existe]['precio'];
                  $('#'+$scope.existe+'a').val($scope.factura[$scope.existe]['total'])
                  $scope.tot=0;
                  for(var i = 0; i < $scope.factura.length; i++) {
                    $scope.tot+=$scope.factura[i]['total'];
                  }
                  $('#sub').val($scope.tot);
                  $('#isv').val($scope.tot*0.15);
                  $('#tot').val($scope.tot+($scope.tot*0.15));

                }else{
                  alert('Ya no hay en el inventario!');
                }
              }
            }
            $('#search').val("");
          }
        }
      }).catch(function(err){
        alert('No existe en la base de datos')
      });
    }

    $scope.efectuarPago =function(){
      $('#efectuarMsg').modal('toggle');
      for (var i = 0; i < $scope.factura.length; i++) {
        VendedorService.Facturar($scope.factura[i]).then(function(response){
        });  
      }
      $scope.crearTotal();
      window.print();
      $scope.factura=[];
      $('#sub').val("");
      $('#isv').val("");
      $('#tot').val("");
      $('#search').val("");
    }

    $scope.changeCant = function(object, $index){
      object.total = $('#'+$index).val()*object.precio;
      $scope.factura[$index]['total']=$('#'+$index).val()*object.precio;
      $scope.tot=0;
      for(var i = 0; i < $scope.factura.length; i++) {
        $scope.tot+=$scope.factura[i]['total'];
      }
      $('#sub').val($scope.tot);
      $('#isv').val($scope.tot*0.15);
      $('#tot').val($scope.tot+($scope.tot*0.15));
    }

    $scope.removeFact =function(object){
      for (var i = $scope.factura.length; i--;) {
        if ($scope.factura[i].id === object.id) {
          $scope.factura.splice(i, 1);
        }
      }
      $scope.tot=0;
      for(var i = 0; i < $scope.factura.length; i++) {
        $scope.tot+=$scope.factura[i]['total'];
      }
      $('#sub').val($scope.tot);
      $('#isv').val($scope.tot*0.15);
      $('#tot').val($scope.tot+($scope.tot*0.15));
    }

    $scope.cancel =function(){
      $scope.factura=[];
      $('#sub').val("");
      $('#isv').val("");
      $('#tot').val("");
      $('#search').val("");
    }

    $scope.crearTotal =function(){
      IngresoService.AddIngreso($scope.tot).then(function(response){
      
      }).catch(function(err){
        alert('No existe en la base de datos')
      });
    } 
}]);
