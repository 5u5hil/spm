var domain = "http://stylepanache.in";


var app = angular.module('StylePanache', ['ngResource', 'ngSanitize', 'ngRoute', 'ngTouch', 'ChangePasswordConfirm']);

angular.module('StylePanache').factory('httpInterceptor', function ($q, $rootScope, $log) {

    var loadingCount = 0;

    return {
        request: function (config) {
            if (++loadingCount === 1)
                $rootScope.$broadcast('loading:progress');
            return config || $q.when(config);
        },
        response: function (response) {
            if (--loadingCount === 0)
                $rootScope.$broadcast('loading:finish');
            return response || $q.when(response);
        },
        responseError: function (response) {
            if (--loadingCount === 0)
                $rootScope.$broadcast('loading:finish');
            return $q.reject(response);
        }
    };

}).config(function ($httpProvider) {

    $httpProvider.interceptors.push('httpInterceptor');

});



app.config(['$routeProvider', '$locationProvider',
    function ($routeProvider, $locationProvider) {
        $routeProvider.
                when('/', {
                    templateUrl: 'pages/home.html',
                    controller: 'homeController'
                }).
                when('/intro', {
                    templateUrl: 'pages/user-onboarding.html',
                    controller: 'introController'
                }).
                when('/cart', {
                    templateUrl: 'pages/cart.html',
                    controller: 'cartController'
                }).
                when('/explore/:url_key', {
                    templateUrl: 'pages/category.html',
                    controller: 'categoryController'
                }).
                when('/subcat/:id', {
                    templateUrl: 'pages/subcat.html',
                    controller: 'subcatController'
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
                when('/questionnaire', {
                    templateUrl: 'pages/questionnaire.html',
                    controller: 'questionnaireController'
                }).
                when('/signup', {
                    templateUrl: 'pages/signup.html',
                    controller: 'signupController'
                }).
                when('/contact', {
                    templateUrl: 'pages/contact.html',
                    controller: 'contactController'
                }).
                when('/profile', {
                    templateUrl: 'pages/profile.html',
                    controller: 'userDashboardController'
                }).
                when('/favorites', {
                    templateUrl: 'pages/favorites.html',
                    controller: 'favoritesController'
                }).
                when('/privacy', {
                    templateUrl: 'pages/privacy-policy.html',
                    controller: 'commonController'
                }).
                when('/define-style', {
                    templateUrl: 'pages/define-style.html',
                    controller: 'commonController'
                }).
                when('/onboarding', {
                    templateUrl: 'pages/user-onboarding.html',
                    controller: 'commonController'
                }).
                when('/travel-planner', {
                    templateUrl: 'pages/travel-planner.html',
                    controller: 'travelPlannerController'
                }).
                when('/faq', {
                    templateUrl: 'pages/faq.html',
                    controller: 'commonController'
                }).
                when('/user-profile/:id', {
                    templateUrl: 'pages/user-profile.html',
                    controller: 'userProfileController'
                }).
                otherwise({
                    redirectTo: '/'
                });

    }
]);
