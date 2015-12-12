angular.module('AngularScaffold.Controllers')
.controller('AdminController', ['$scope','$state', 'HomeService', function ($scope,$state, HomeService) {
  $scope.title = "Administrador"
  $scope.productos = [];
  $scope.producto = {};
  $scope.productoM={};
  $scope.prod={};
  $scope.search={};
  $scope.template = '';
  $scope.user = {};
  $scope.users  =[];
  $scope.subarreglo_cantidad =[];
  $scope.nombre_producto = [];
  $scope.cantidad_prodcuto =[];
  $scope.productos_en_riesgo = [];
  $scope.fecha_ingreso={};
  $scope.arrIngreso=[];
  $scope.fechas =[];
  $scope.ingresofecha=[];
  $scope.Ingresovalor =[];

  $scope.getProductos = function(){
    HomeService.GetProductos().then(function(response){
      $scope.productos = response.data;
      $scope.subarreglo_cantidad=[];
      $scope.nombre_producto = [];
      $scope.cantidad_prodcuto =[];
      $scope.productos_en_riesgo = [];
      for (var i = 0; i<$scope.productos.length; i++) {
        $scope.subarreglo_cantidad.push([$scope.productos[i]["descripcion"],$scope.productos[i]["cantidad"]]);
        $scope.nombre_producto.push($scope.productos[i]["descripcion"]);
        $scope.cantidad_prodcuto.push($scope.productos[i]["cantidad"]);
        var dias_restantes =Math.abs( $scope.calcular_fecha($scope.productos[i]["fecha_venc"]));
        if (  dias_restantes <= 20 ) {
          $scope.productos_en_riesgo.push($scope.productos[i]);
        };
      };
      $scope.grafica_producto1();
      $scope.graficaInventario(); 
    }).catch(function(err){
      alert('Error fetching productos')
    });
  }

  $scope.getProductos();

  $scope.addProductos = function(){
    HomeService.PostProductos($scope.producto).then(function(response){
      $scope.getProductos();
    }).catch(function(err){
      alert("Error posting to productos");
    });
  }

  $scope.getUsers =function(){
    HomeService.GetUsers().then(function(response){
      $scope.users=response.data;
    }).catch(function(err){
      alert('Error fetching users')
    });
  }

  $scope.getUsers();

  $scope.delProd=function(object){
    HomeService.DelProductos(object.id).then(function(response){
    }).catch(function(err){
      alert('Error fetching products')
    });
    $scope.getProductos();
  }

  $scope.delUser=function(object){
    HomeService.DelUsers(object.username).then(function(response){
    }).catch(function(err){
      alert('Error fetching users')
      console.log(object)
    });
    $scope.getUsers();
  }

  $scope.cambiar_div = function(nombre){
    if (nombre==="vendedor") {
      $scope.template = '/views/vendedor_admin.html';
    }else if (nombre==="productos_admin"){
      $scope.template = '/views/productos_admin.html';
    }else if (nombre==="productos_riesgo") {
      $scope.template = '/views/productos_riesgo_admin.html';
    }else if (nombre==="graficas_ingreso") {
      $scope.template = '/views/graficas_ingreso.html';
    }else if (nombre==="graficas_producto") {
      $scope.template = '/views/grafica_producto.html';
    };
  }

  $scope.goVend=function(){
    $state.go('vendedor');
  }

  $scope.register = function(){
    var user = {
     username: $scope.user.username, 
     password:  $scope.user.password, 
     ID: $scope.user.ID,
     nombre: $scope.user.nombre,
     scope: [$scope.user.scope]};
     HomeService.Register(user).then(function(response){
      alert('Registered in correctly!');
    }).catch(function(err){
      alert(err.data.error + " " + err.data.message);
    })
    $scope.user={
     username: "", 
     password:  "", 
     ID: "",
     nombre: "",
     scope: [""]};
   }

   $scope.ponerModProd =function(object){
    $scope.productoM={
      id : object.id,
      descripcion : object.descripcion,
      fecha_ingreso: new Date(object.fecha_ingreso),
      fecha_venc: new Date(object.fecha_venc),
      precio: object.precio,
      cantidad: object.cantidad
    }
  }

  $scope.putProd = function(){
    HomeService.PutProductos($scope.productoM).then(function(response){
      alert('Modified correctly!');
    }).catch(function(err){
      alert(err.data.error + " " + err.data.message);
    })
    $scope.getProductos();
    $scope.productoM={
      id : "",
      descripcion : "",
      fecha_ingreso: "",
      fecha_venc: "",
      precio: "",
      cantidad: ""
    }
  }

  /*¨grafica para productos disponibles*/
  $scope.grafica_producto1 = function () {
    var serie1 =[["Honduras",10],["Nicaragua",15],["Panama",50]];
    $('#container1').highcharts({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Ingresando data a la grafica'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
            style: {
              color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
            }
          }
        }
      },
      series: [{
        name: "Brands",
        colorByPoint: true,
        data:  $scope.subarreglo_cantidad
      }]
    });
  };
  $scope.grafica_producto1();
  $scope.graficaInventario = function () {
    $('#container_inventario').highcharts({
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Control Inventario'
      },
      subtitle: {
        text: 'Productos en Existencia'
      },
      xAxis: {
        categories: $scope.nombre_producto,
        title: {
          text: null
        }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Cantidad (Unidad)',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        }
      },
      tooltip: {
        valueSuffix: ' Unidades'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          }
        }
      },
      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        x: -40,
        y: 80,
        floating: true,
        borderWidth: 1,
        backgroundColor: ((Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'),
        shadow: true
      },
      credits: {
        enabled: false
      },
      series: [{
        name: "Cantidad",
        colorByPoint: true,
        data: $scope.cantidad_prodcuto
      }]
    });
};

$scope.grafica_de_ingreso = function(){

  $('#grafica_ingresos').highcharts({
    title: {
      text: 'Combination chart'
    },
    xAxis: {
      categories: $scope.ingresofecha
    },
    labels: {
      items: [{
        html: 'Total fruit consumption',
        style: {
          left: '50px',
          top: '18px',
          color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
        }
      }]
    },
    series: [{
      type: 'column',
      name: 'Jane',
      data: [3, 2, 1, 3, 4]
    }, {
      type: 'column',
      name: 'John',
      data: [2, 3, 5, 7, 6]
    }, {
      type: 'column',
      name: 'Joe',
      data: [4, 3, 3, 9, 0]
    }, {
      type: 'spline',
      name: 'Average',
      data: [3, 2.67, 3, 6.33, 3.33],
      marker: {
        lineWidth: 2,
        lineColor: Highcharts.getOptions().colors[3],
        fillColor: 'white'
      }
    }, {
      type: 'pie',
      name: 'Total consumption',
      data: [{
        name: 'Jane',
        y: 13,
                color: Highcharts.getOptions().colors[0] // Jane's color
              }, {
                name: 'John',
                y: 23,
                color: Highcharts.getOptions().colors[1] // John's color
              }, {
                name: 'Joe',
                y: 19,
                color: Highcharts.getOptions().colors[2] // Joe's color
              }],
              center: [100, 80],
              size: 100,
              showInLegend: false,
              dataLabels: {
                enabled: false
              }
            }]
          });
);



}
$scope.graficaInventario(); 
$scope.calcular_fecha = function(fecha){
 var f1=fecha;
 var fecha_actual = new  Date();
 var f2=fecha_actual.getFullYear()+"-"+(fecha_actual.getMonth()+1)+"-"+fecha_actual.getDate();
 var aFecha1 = f1.split('-'); 
 var aFecha2 = f2.split('-');

 var fFecha1 = Date.UTC(aFecha1[0],aFecha1[1]-1,aFecha1[2]); 
 var fFecha2 = Date.UTC(aFecha2[0],aFecha2[1]-1,aFecha2[2]); 

 var dif = fFecha2 - fFecha1;
 var dias = Math.floor(dif / (1000 * 60 * 60 * 24)); 
 return dias;
}

$scope.getIngresos = function(){
  HomeService.GetIngresos().then(function(response){
   $scope.fechas= response.data;
   var fechaInicial=$scope.fecha_ingreso.inicial;
   var fechaFinal=$scope.fecha_ingreso.final;

   var fi=fechaInicial.getFullYear()+"-"+(fechaInicial.getMonth()+1)+"-"+fechaInicial.getDate();
   var ff=fechaFinal.getFullYear()+"-"+(fechaFinal.getMonth()+1)+"-"+fechaFinal.getDate();

   var fechaI = fi.split('-'); 
   var  fechaF = ff.split('-');

   var fFecha1 = Date.UTC(fechaI[0],fechaI[1]-1,fechaI[2]); 
   var fFecha2 = Date.UTC(fechaF[0],fechaF[1]-1,fechaF[2]);

   $scope.arrIngreso=[];
   for (var i = 0; i <$scope.fechas.length; i++) {

     var ft = $scope.fechas[i].fecha; 
     console.log(ft)
     var fecha_tabla=ft.split('-')
     var valor= Date.UTC(fecha_tabla[0],fecha_tabla[1]-1,fecha_tabla[2]); 
     if (valor >=fFecha1 && valor <fFecha2) {
      $scope.arrIngreso.push($scope.fechas[i]);
    };

  };
  console.log($scope.arrIngreso)  
  for (var i =0; i <$scope.arrIngreso.length; i++) {
    if($scope.ingresofecha.indexOf($scope.arrIngreso[i].fecha)==-1){
      $scope.ingresofecha.push($scope.arrIngreso[i].fecha)
    }
  }
  for (var i = 0; i < $scope.ingresofecha.length; i++) {
    $scope.Ingresovalor.push(0);
  };
  for (var i =0; i <$scope.arrIngreso.length; i++) {

    if ($scope.ingresofecha.indexOf($scope.arrIngreso[i].fecha)!=-1) {
      $scope.Ingresovalor[$scope.ingresofecha.indexOf($scope.arrIngreso[i].fecha)]+=$scope.arrIngreso[i].total;
    }
    
  }
  console.log($scope.ingresofecha);
  console.log($scope.Ingresovalor);
  $scope.grafica_de_ingreso();
}).catch(function(err){
  alert('Error fetching productos')
});
}

}]);
