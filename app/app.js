var app = angular.module('AngularScaffold', ['ui.router', 'ngStorage','AngularScaffold.Services', 'AngularScaffold.Controllers']);

angular.module('AngularScaffold.Controllers', []);
angular.module('AngularScaffold.Services', []);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('login');
	$stateProvider
		.state('login', {
            url: '/login',
            params: {content:undefined},
            templateUrl: '/views/login.html',
            controller: 'LoginController'
        })
        .state('vendedor', {
            url: '/vendedor',
            params: {content:undefined},
            templateUrl: '/views/vendedor.html',
            controller: 'VendedorController'
        })
        .state('admin', {
            url: '/admin',
            params: {content:undefined},
            templateUrl: '/views/admin2.html',
            controller: 'AdminController'
        });   
}])
