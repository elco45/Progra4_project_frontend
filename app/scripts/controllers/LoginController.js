angular.module('AngularScaffold.Controllers')
  .controller('LoginController', ['$scope','$state', 'UserService', function ($scope,$state, UserService) {
    	$scope.title = "Login"

    	$scope.goVendedor=function(){
    		$state.go('vendedor');
    	}
}]);
