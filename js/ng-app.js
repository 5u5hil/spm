app.controller('homeController', function($http, $scope, $rootScope, $controller) {

    loaderShow();

    $http.get(domain + '/home').success(function(data, response, status, headers, config) {
        $rootScope.categories = data.categories;
        $scope.sliders = data.sliders;
        $scope.new = data.new;
        $scope.imgPath = domain + "/public/admin/uploads/slider/";
        $rootScope.$digest;
        loaderHide();
    });

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        siteMainFn();
        $rootScope.myFunc = function() {
            siteMainFn();
        };
        myFunc();
    });

});


app.controller('categoryController', function($http, $scope, $location, $rootScope, $routeParams) {

    loaderShow();

    $http.get(domain + "/get-category-products/" + $routeParams.url_key).success(function(data, status, headers, config) {
        $scope.products = data;
        $scope.$digest;
        loaderHide();
    });

    $scope.load = function(url) {
        loaderShow();
        $http.get(url).success(function(data, status, headers, config) {
            $scope.products = data;
            $scope.$digest;
            loaderHide();
        });
    };


    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});

app.controller('productController', function($http, $rootScope, $scope, $location, $routeParams) {

    loaderShow();

    $http.get(domain + "/product-details/" + $routeParams.url_key).success(function(data, status, headers, config) {
        $scope.product = data;
        $scope.$digest;
        loaderHide();
    });

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});

app.controller('scrapbookController', function($http, $scope, $rootScope, $controller) {

    loaderShow();

    $http.get(domain + "/get-scrapbook-products").success(function(data, status, headers, config) {
        $scope.products = data;
        $scope.imgPath = domain + "/public/frontend/uploads/scrapbooks/";
        loaderHide();
    });


    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});

app.controller('scrapbookDetailsController', function($http, $scope, $rootScope, $location, $routeParams) {

    loaderShow();

    $http.get(domain + "/scrapbook/" + $routeParams.url_key).success(function(data, status, headers, config) {
        $scope.scrapbookproducts = data;
        $scope.imgPath = domain + "/public/frontend/uploads/scrapbooks/";
        loaderHide();
    });

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });
});

app.controller('loginController', function($http, $rootScope, $location, $scope) {
    jQuery(".selectStyle").hide();
    loaderHide();

    $scope.login = function() {
        loaderShow();
        jQuery.ajax({
            type: "POST",
            url: domain + "/check-user",
            data: jQuery("#loginuser").serialize(),
            cache: false,
            success: function(data) {
                loaderHide();
                if (data[0] == "invalid") {
                    $rootScope.isLoggedin = false;
                    alert("Invalid login");
                } else {
                    $rootScope.isLoggedin = true;
                    $scope.$apply(function() {
                        $scope.preferences = data.preferences;
                    });
                    jQuery(".login").hide();
                    jQuery(".selectStyle").show();
                }
            }
        });
    };

    $scope.setPreference = function() {

        loaderShow();

        if (jQuery("#preference").val() == "") {
            window.location.href = "#/add-new-style";
        } else {

            jQuery.ajax({
                type: "POST",
                url: domain + "/get-style-preference",
                data: jQuery("#setPreference").serialize(),
                cache: false,
                success: function(data) {
                    window.location.href = "#/";
                }
            });
        }
    };

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });
});

app.controller('bodyCharacteristicsController', function($http, $scope, $rootScope, $location) {

    loaderShow();

    $http.get(domain + '/body-characteristics').success(function(data, response, status, headers, config) {
        $scope.categories = data;
        $scope.imgPath = domain + "/public/admin/uploads/catalog/category/";
        loaderHide();
    });

    $scope.addPref = function() {
        loaderShow();
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-style-preference",
            data: jQuery("[name='addStyleForm']").serialize(),
            cache: false,
            success: function(data) {

                window.location.href = "#/";
            }
        });
    };

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });
});
// Directive- event on ng-repeat finish
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
