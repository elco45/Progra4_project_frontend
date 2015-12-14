angular.module('AngularScaffold.Services').factory('ProductoService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		var baseUrl = 'https://bodega-emelina-backend.herokuapp.com/';
		return {
			GetProductos:function(){
				return $http.get(baseUrl + "v1/productos");
			},
			PostProductos: function(payload){
				return $http.post(baseUrl + "v1/productos",payload);
			},
		    PutProductos: function(payload){
				return $http.put(baseUrl+"v1/modprod",payload);
			},
			DelProductos: function(id){
				return $http.delete(baseUrl+"v1/delprod/"+id);
			}
	    };
}]);
