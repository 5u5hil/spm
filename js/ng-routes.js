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
                when('/explore-style/:url_key', {
                    templateUrl: 'pages/mystyleproducts.html',
                    controller: 'myStyleController'
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
                    templateUrl: 'pages/logout.html',
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
                when('/my-scrapbook', {
                    templateUrl: 'pages/scrapbook.html',
                    controller: 'myScrapbookController'
                }).
                when('/create-scrapbook', {
                    templateUrl: 'pages/create-scrapbook.html',
                    controller: 'createScrapbookController'
                }).
                when('/wardrobe', {
                    templateUrl: 'pages/wardrobe.html',
                    controller: 'wardrobeController'
                }).
                when('/wardrobe-listing/:id', {
                    templateUrl: 'pages/wardrobe-listing.html',
                    controller: 'wardrobeListingController'
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
                    templateUrl: 'pages/add-new-wardrobe.html',
                    controller: 'addWardrobeController'
                }).
                when('/chat', {
                    templateUrl: 'pages/chat.html',
                    controller: 'chatController'
                }).
                otherwise({
                    redirectTo: '/'
                });

    }
]);
