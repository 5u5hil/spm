app.controller('homeController', function($http, $scope, $rootScope, $controller) {
    $http.get(domain + '/navigation').success(function(data, response, status, headers, config) {
        $rootScope.categories = data;
        $rootScope.$digest;
    });

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
   siteMainFn();

    });

});

app.controller('scrapbookController', function($http, $scope, $rootScope, $controller) {
    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});
app.directive('onFinishRender', function($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function() {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});
