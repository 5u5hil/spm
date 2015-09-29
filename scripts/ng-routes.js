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
                    templateUrl: 'resources/views/frontend/pages/product-listing.html',
                    controller: 'productListingController'
                }).
                when('/product-detail', {
                    templateUrl: 'resources/views/frontend/pages/product-detail.html',
                    controller: 'productController'
                }).
                when('/login', {
                    templateUrl: 'resources/views/frontend/pages/login.html',
                    controller: 'loginController'
                }).
                when('/logout', {
                    templateUrl: 'resources/views/frontend/pages/home.html',
                    controller: 'logoutController'
                }).
                when('/scrapbook/:url_key', {
                    templateUrl: 'resources/views/frontend/pages/scrapbook-detail.html',
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
                    templateUrl: 'resources/views/frontend/pages/add-new-style.html',
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
