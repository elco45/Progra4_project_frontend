angular.module('AngularScaffold.Services').factory('VendedorService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		var baseUrl = 'http://localhost:8000/';
		return {
			AddFactura: function(payload){
				return $http.post(baseUrl + "v1/linea_fact",payload);
			},
			Facturar: function(payload){
				return $http.put(baseUrl + "v1/fact",payload);
			}
	    };
}]);
