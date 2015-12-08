angular.module('AngularScaffold.Services').factory('AuthService', ['$http', 
	function($http){
		$http.defaults.withCredentials =true;
		var baseUrl='https://bodega-emelina-backend.herokuapp.com/'
		return {
			Logout: function(){
				return $http.get(baseUrl+"v1/logout");
			},
			Login: function(payload){
				return $http.post(baseUrl+"v1/login", payload);
			}
	        
	    };
}]);
