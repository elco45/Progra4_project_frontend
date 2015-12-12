angular.module('AngularScaffold.Services').factory('HomeService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		var baseUrl = 'http://localhost:8000/';
		return {
			AddFactura: function(payload){
				return $http.post(baseUrl + "v1/linea_fact",payload);

			},
			Facturar: function(payload){
				return $http.put(baseUrl + "v1/fact",payload);
			},
			GetProductos:function(){
				return $http.get(baseUrl + "v1/productos");
			},
			PostProductos: function(payload){
				console.log(payload);
				return $http.post(baseUrl + "v1/productos",payload);
			},
			Register: function(payload){
	          return $http.post(baseUrl + "v1/register", payload);
	        },
	        GetUsers:function(){
				return $http.get(baseUrl + "v1/users");
			},
		    PutProductos: function(payload){
				return $http.put(baseUrl+"v1/modprod",payload);
			},
			DelProductos: function(id){
				return $http.delete(baseUrl+"v1/delprod/"+id);
			},
			DelUsers: function(username){
				return $http.delete(baseUrl+"v1/deluser/"+username);
			},
			AddIngreso: function(payload){
				return $http.post(baseUrl+"v1/ingreso",payload);
			},
			GetIngresos: function(){
				console.log("DDDDDDDDDddd");
				return $http.get(baseUrl+"v1/getTIngreso");
			} 
	    };
}]);