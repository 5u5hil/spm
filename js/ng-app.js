// Directive - event on ng-repeat finish
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

app.controller('homeController', function ($http, $scope, $rootScope, $controller) {

    loaderShow();

    $http.get(domain + '/home').success(function (data, response, status, headers, config) {
        $rootScope.categories = data.categories;
        $scope.sliders = data.sliders;
        $scope.new = data.new;
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

});

app.controller('categoryController', function ($http, $scope, $location, $rootScope, $routeParams) {

    loaderShow();

    $http.get(domain + "/get-category-products/" + $routeParams.url_key).success(function (data, status, headers, config) {
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

    $http.get(domain + "/scrapbook/" + $routeParams.url_key).success(function (data, status, headers, config) {
        $scope.scrapbookproducts = data;
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

                    $scope.$apply(function () {
                        $scope.preferences = data.preferences;
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

        if (jQuery("#preference").val() == "") {
            window.location.href = "#/add-new-style";
        } else {

            jQuery.ajax({
                type: "POST",
                url: domain + "/get-style-preference",
                data: jQuery("#setPreference").serialize(),
                cache: false,
                success: function (data) {
                    window.location.href = "#/";
                }
            });
        }
    };

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
});

app.controller('bodyCharacteristicsController', function ($http, $scope, $rootScope, $location) {

    loaderShow();

    $http.get(domain + '/body-characteristics').success(function (data, response, status, headers, config) {
        $scope.categories = data;
        $scope.imgPath = domain + "/public/admin/uploads/catalog/category/";
        loaderHide();
    });

    $scope.addPref = function () {
        loaderShow();
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-style-preference",
            data: jQuery("[name='addStyleForm']").serialize(),
            cache: false,
            success: function (data) {

                window.location.href = "#/";
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

        var $ = jQuery;
        $("input[type='file']").click(function (e) {
            e.preventDefault();

            navigator.notification.confirm(
                    'Please select image', // message
                    function (buttonIndex) {
                        if (buttonIndex === 1) {
                            photoFromSource(navigator.camera.PictureSourceType.CAMERA);
                        } else {
                            photoFromSource(navigator.camera.PictureSourceType.PHOTOLIBRARY);
                        }
                    }, // callback to invoke with index of button pressed
                    'Image capture', // title
                    ['Camera', 'Gallery']     // buttonLabels
                    );



        });
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

        $ = jQuery;
        $("input[type='file']").click(function (e) {
            e.preventDefault();

            navigator.notification.confirm(
                    'Please select image', // message
                    function (buttonIndex) {
                        if (buttonIndex === 1) {
                            photoFromSource(navigator.camera.PictureSourceType.CAMERA);
                        } else {
                            photoFromSource(navigator.camera.PictureSourceType.PHOTOLIBRARY);
                        }
                    }, // callback to invoke with index of button pressed
                    'Image capture', // title
                    ['Camera', 'Gallery']     // buttonLabels
                    );



        });
    });
});

app.controller('chatController', function ($http, $scope, $rootScope, $controller) {

    loaderHide();

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

});