var domain = "http://sp.boxcommerce.in";


var app = angular.module('StylePanache', ['ngResource', 'ngSanitize', 'ngRoute', 'ngTouch']);



app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.
                when('/', {
                    templateUrl: 'pages/home.html',
                    controller: 'homeController'
                }).
                when('/explore/:url_key', {
                    templateUrl: 'pages/category.html',
                    controller: 'categoryController'
                }).
                when('/product/:url_key', {
                    templateUrl: 'pages/product.html',
                    controller: 'productController'
                }).
                when('/login', {
                    templateUrl: 'pages/login.html',
                    controller: 'loginController'
                }).
                when('/logout', {
                    templateUrl: 'resources/views/frontend/pages/home.html',
                    controller: 'logoutController'
                }).
                when('/scrapbook/:url_key', {
                    templateUrl: 'pages/scrapbook-details.html',
                    controller: 'scrapbookDetailsController'
                }).
                when('/scrapbook', {
                    templateUrl: 'pages/scrapbook.html',
                    controller: 'scrapbookController'
                }).
                when('/wardrobe', {
                    templateUrl: 'resources/views/frontend/pages/wardrobe.html',
                    controller: 'wardrobeController'
                }).
                when('/contact', {
                    templateUrl: 'resources/views/frontend/pages/contact.html',
                    controller: 'mainController'
                }).
                when('/style-profile', {
                    templateUrl: 'resources/views/frontend/pages/contact.html',
                    controller: 'mainController'
                }).
                when('/add-new-style', {
                    templateUrl: 'pages/add-new-style.html',
                    controller: 'bodyCharacteristicsController'
                }).
                when('/add-new-wardrobe', {
                    templateUrl: 'resources/views/frontend/pages/add-new-wardrobe.html',
                    controller: 'wardrobeController'
                }).
                when('/create-scrapbook', {
                    templateUrl: 'resources/views/frontend/pages/create-scrapbook.html',
                    controller: 'scrapbookController'
                }).
                otherwise({
                    redirectTo: '/'
                });

    }
]);
