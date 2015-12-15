angular.module('AngularScaffold.Services').factory('IngresoService', ['$http',
	function($http){
		$http.defaults.withCredentials = true;
		var baseUrl = 'https://bodega-emelina-backend.herokuapp.com/';
		return {
			AddIngreso: function(payload){
				return $http.post(baseUrl+"v1/ingreso",payload);
			},
			GetIngresos: function(){
				return $http.get(baseUrl+"v1/getIngreso");
			} 
	    };
}]);
