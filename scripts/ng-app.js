app.controller('homeController', function($http, $scope, $rootScope, $controller) {
    $http.get(domain + '/navigation').success(function(data, response, status, headers, config) {
        $rootScope.categories = data;
        $rootScope.$digest;
    });

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });
    $rootScope.myFunc = function(){
    siteMainFn();
};

});

app.controller('scrapbookController', function($http, $scope, $rootScope, $controller) {
    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});
 
