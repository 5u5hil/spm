app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    };
});

angular.module('ChangePasswordConfirm', []).directive('changePasswordC', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$setValidity('noMatch1', true);

            attrs.$observe('changePasswordC', function (newVal) {
                if (newVal === 'true') {
                    ctrl.$setValidity('noMatch1', true);
                } else {
                    ctrl.$setValidity('noMatch1', false);
                }
            });
        }
    };
});

app.controller('homeController', function ($http, $scope, $rootScope, $controller) {

    loaderShow();

    $http.get(domain + "/home"+ (window.localStorage.getItem('id') != null ? "?userId="+window.localStorage.getItem('id') : "" )).success(function (data, response, status, headers, config) {
        $rootScope.categories = data.categories;
        $scope.sliders = data.sliders;
        $scope.new = data.new;
        console.log(data.new);
        $scope.imgPath = domain + "/public/admin/uploads/slider/";
        $rootScope.$digest;
        loaderHide();
    });

    $scope.$on('ngRepeatFinished', function (ngRepeatFinishedEvent) {
        siteMainFn();
        $rootScope.myFunc = function () {
            siteMainFn();
        };

    });

//    $scope.addToList = function (event, id) {
//        if (window.localStorage.getItem('id') != null) {
//            $http.get(domain + "/add-to-savedlist?productID=" + id + "&userId=" + window.localStorage.getItem('id')).success(function (response) {
//                console.log(angular.element(event.target).parent());
//                if (response == 1) {
//                    angular.element(event.target).addClass("puffIn liked");
//
//                } else {
//                    angular.element(event.target).removeClass("puffIn liked");
//                }
//            });
//
//        } else {
//            window.location.href = '#/login';
//        }
//    };

});

app.controller('categoryController', function ($http, $scope, $location, $rootScope, $routeParams) {

    loaderShow();

    $http.get(domain + "/get-category-products/" + $routeParams.url_key + "?userId=" + window.localStorage.getItem('id')).success(function (data, status, headers, config) {
        $scope.products = data;
        $scope.$digest;
        loaderHide();
    });

    $scope.load = function (url) {
        loaderShow();
        $http.get(url).success(function (data, status, headers, config) {
            $scope.products = data;
            $scope.$digest;
            loaderHide();
        });
    };


    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

});

app.controller('productController', function ($http, $rootScope, $scope, $location, $routeParams) {

    loaderShow();

    $http.get(domain + "/product-details/" + $routeParams.url_key).success(function (data, status, headers, config) {
        $scope.product = data;
        $scope.$digest;
        loaderHide();
    });

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

});

app.controller('scrapbookController', function ($http, $scope, $rootScope, $controller) {

    loaderShow();

    $http.get(domain + "/get-scrapbook-products").success(function (data, status, headers, config) {
        $scope.products = data;
        $scope.imgPath = domain + "/public/frontend/uploads/scrapbooks/";
        loaderHide();
    });


    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

});

app.controller('myScrapbookController', function ($http, $scope, $rootScope, $controller) {

    loaderShow();

    $http.get(domain + "/get-myscrapbook-products?userId=" + window.localStorage.getItem('id')).success(function (data, status, headers, config) {
        $scope.products = data;
        $scope.imgPath = domain + "/public/frontend/uploads/scrapbooks/";
        loaderHide();
    });


    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

});

app.controller('scrapbookDetailsController', function ($http, $scope, $rootScope, $location, $routeParams) {

    loaderShow();

    $http.get(domain + "/scrapbook/" + $routeParams.url_key + "?userId=" + window.localStorage.getItem('id')).success(function (data, status, headers, config) {
        $scope.scrapbookproducts = data;
        console.log(data);
        $scope.imgPath = domain + "/public/frontend/uploads/scrapbooks/";
        loaderHide();
    });

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
});

app.controller('loginController', function ($http, $rootScope, $location, $scope) {
    jQuery(".selectStyle").hide();
    loaderHide();

    $scope.login = function () {
        loaderShow();
        jQuery.ajax({
            type: "POST",
            url: domain + "/check-user",
            data: jQuery("#loginuser").serialize(),
            cache: false,
            success: function (data) {
                loaderHide();
                if (data[0] == "invalid") {
                    $rootScope.loggedIn = 0;
                    alert("Invalid login");
                } else {
                    $rootScope.loggedIn = 1;
                    window.localStorage.setItem('id', data.id);
                    window.localStorage.setItem('name', data.first_name);
                    window.localStorage.setItem('email', data.email);
                    window.localStorage.setItem('member', data.is_member);
                    window.localStorage.setItem('department', data.department.name);
                    $scope.$apply(function () {
                        $scope.preferences = data.preferences;
                    });

                    $rootScope.$apply(function () {
                        $rootScope.styles = data.preferences;
                    });
                    $rootScope.$digest;
                    jQuery(".login").hide();
                    jQuery(".selectStyle").show();
                }
            }
        });
    };

    $scope.setPreference = function () {

        loaderShow();


        window.location.href = "#/add-new-style";

    };

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
});

app.controller('bodyCharacteristicsController', function ($http, $scope, $rootScope, $location) {

    loaderShow();

    $scope.userId = window.localStorage.getItem('id');

    $http.get(domain + '/body-characteristics').success(function (data, response, status, headers, config) {
        $scope.categories = data;
        $scope.imgPath = domain + "/public/admin/uploads/catalog/category/";
        loaderHide();
    });
    $scope.getGallery = function ()
    {

        jQuery('.to-cat-select').click(function (event) { /* Act on the event */
            event.preventDefault();
            jQuery(this).closest("div.child").find(".item-selected").removeClass("item-selected");
            jQuery(this).addClass("item-selected").prev(":radio").click();
        })

    };
    $scope.addPref = function () {
        loaderShow();
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-style-preference",
            data: jQuery("[name='addStyleForm']").serialize(),
            cache: false,
            success: function (data) {

                jQuery(".newStyle").append('<li><a ng-href="#/explore-style/' + data.id + '" class="active-menu"><i class="fa fa-angle-right"></i>' + data.style_name + '<i class="fa fa-circle"></i></a></li>');
                window.location.href = "#/explore-style/" + data.id;
            }
        });
    };

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
});

app.controller('addWardrobeController', function ($http, $scope, $rootScope, $location) {

    loaderShow();

    $http.get(domain + "/get-wardrobe-category").success(function (data, status, headers, config) {
        $scope.wardrobecats = data;
        $scope.userId = window.localStorage.getItem('id');
        $scope.$digest;
        loaderHide();
    });

    $scope.addWardrobePref = function () {
        var data = new FormData(jQuery("[name='wardrobefrm']")[0]);
        loaderShow();
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-wardrobe-preference",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                window.location.href = "#/wardrobe";
            }
        });
    };

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
});

app.controller('wardrobeController', function ($http, $scope, $rootScope, $location, $routeParams) {

    loaderShow();

    $http.get(domain + "/get-wardrobe-products?userId=" + window.localStorage.getItem('id')).success(function (data, status, headers, config) {
        $scope.name = window.localStorage.getItem('name');
        $scope.wardrobeprods = data;
        window.localStorage.setItem('wardrobeprods', JSON.stringify(data));
        loaderHide();
    });

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
});

app.controller('wardrobeListingController', function ($http, $scope, $rootScope, $location, $routeParams, $filter) {

    loaderShow();
    $scope.imgPath = domain + "/public/frontend/uploads/wardrobes/";
    $scope.wardrobeList = $filter('filter')(jQuery.parseJSON(window.localStorage.getItem('wardrobeprods')), {id: $routeParams.id}, true)[0];
    loaderHide();

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
});

app.controller('createScrapbookController', function ($http, $scope, $rootScope, $location) {
    $scope.userId = window.localStorage.getItem('id');

    $scope.autoCompleteFn = function () {
        var $ = jQuery;
        function log(message) {
            $("<div>").html(message).prependTo("#log");
            $("#log").scrollTop(0);

        }

        $products = $("#pdcts");

        $products.autocomplete({
            source: domain + "/search-products",
            minLength: 2,
            select: function (event, ui) {

                log(ui.item ?
                        "<img  style='vertical-align: middle; margin-bottom: 5px;'src='" + (ui.item.large_image != '' ? ui.item.large_image : (ui.item.medium_image != '' ? ui.item.medium_image : ui.item.small_image)) + "' width='50px;' >" + ui.item.label + "<input type='hidden' name='pid[]' value='" + ui.item.id + "' ><a href='#' class='pull-right remove-rag'  ><i class='fa fa-trash'></i></a>" : "");
            }

        });

        $products.data("ui-autocomplete")._renderItem = function (ul, item) {
            return $("<li>")
                    .append("<a><img style='vertical-align:middle' src='" + (item.large_image != '' ? item.large_image : (item.medium_image != '' ? item.medium_image : item.small_image)) + "' width='25px;'>" + item.label + "</a>")
                    .appendTo(ul);

        };
    };

    $http.get(domain + "/get-scrapbook-products").success(function (data, status, headers, config) {
        $scope.scrapbookprods = data;
    });

    $scope.addScrapbook = function () {
        loaderShow();
        var data = new FormData(jQuery("[name='scrapbookfrm']")[0]);
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-scrapbook",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                window.location.href = "#/scrapbook";
            }
        });
    };

    loaderHide();

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
});

app.controller('chatController', function ($http, $scope, $rootScope, $controller) {

    loaderHide();

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

});

app.controller('questionnaireController', function ($http, $scope, $rootScope, $controller) {

    loaderHide();

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
    
    $scope.submitAns = function() {
        console.log('submit');
    };

});

app.controller('logoutController', function ($http, $rootScope, $location, $scope) {
    loaderHide();
    $rootScope.loggedIn = 0;
    $rootScope.$digest;
    localStorage.clear();
    window.location.href = "#/";


    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
});

app.controller('myStyleController', function ($http, $scope, $location, $rootScope, $routeParams) {

    loaderShow();

    $http.get(domain + "/my-style/" + $routeParams.url_key).success(function (data, status, headers, config) {
        $scope.products = data;
        $scope.$digest;
        loaderHide();
    });

    $scope.load = function (url) {
        loaderShow();
        $http.get(url).success(function (data, status, headers, config) {
            $scope.products = data;
            $scope.$digest;
            loaderHide();
        });
    };


    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

});

app.controller('signupController', function ($http, $scope, $location, $rootScope, $routeParams) {

    loaderHide();

    $scope.signup = function () {
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-reg",
            data: jQuery("#signup input").serialize(),
            cache: false,
            success: function (data) {
                // console.log(data);

                if (data == "register") {
                    alert("Email is already registered.");
                } else {
                    window.location.href = "#/login";
                }
            }
        });
    }

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

});

app.controller('cartController', function ($http, $scope, $location, $rootScope, $routeParams) {

    loaderShow();

    $scope.cart = jQuery.parseJSON(window.localStorage.getItem("cart"));
    $scope.cart.Total = 0;
    jQuery.each(jQuery.parseJSON(window.localStorage.getItem("cart")), function (k, v) {
        $scope.cart.Total += parseInt(v.price);
    });

    loaderHide();
    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

});

app.controller('contactController', function ($http, $scope, $location, $rootScope, $routeParams) {



    loaderHide();
    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

});

app.controller('userDashboardController', function ($http, $scope, $location, $rootScope, $routeParams) {
    $scope.userId = window.localStorage.getItem('id');
    
    loaderShow();
    $http.get(domain + "/get-user-details?userId=" + window.localStorage.getItem('id')).success(function (data, status, headers, config) {
        $scope.userDetails = data;
        $scope.$digest;
            loaderHide();
    });

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
    
    $scope.updateUDetails = function () {        
        jQuery.ajax({
            type: "POST",
            url: domain + "/update-user-details",
            data: jQuery("#userDetailsfrm input").serialize(),
            cache: false,
            success: function (data) {
                console.log(data);
                if(data[0] == "success")
                    alert("Profile updated!");
                else
                    alert("Error:Please try again later!");
                
                window.location.href = "#/profile";
            }
        });
    };
        
});

app.controller('favoritesController', function ($http, $scope, $location, $rootScope, $routeParams) {
    $scope.userId = window.localStorage.getItem('id');
    
    loaderShow();

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
    
    $http.get(domain + "/wish-list-products?userId=" + window.localStorage.getItem('id')).success(function (data, status, headers, config) {
        $scope.userFavorites = data;
        console.log(data);
        $scope.$digest;
        loaderHide();
    });    
});

