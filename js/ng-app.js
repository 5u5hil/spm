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
    };
});

app.run(function($rootScope, $location) {
    $rootScope.$on('$locationChangeSuccess', function() {
        if ($rootScope.previousLocation == $location.path()) {
            window.localStorage.setItem("back", 1);

        } else {

            window.localStorage.removeItem("back");
        }
        $rootScope.previousLocation = $rootScope.actualLocation;
        $rootScope.actualLocation = $location.path();
    });
});


angular.module('ChangePasswordConfirm', []).directive('changePasswordC', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            ctrl.$setValidity('noMatch1', true);

            attrs.$observe('changePasswordC', function(newVal) {
                if (newVal === 'true') {
                    ctrl.$setValidity('noMatch1', true);
                } else {
                    ctrl.$setValidity('noMatch1', false);
                }
            });
        }
    };
});

app.controller('homeController', function($http, $scope, $rootScope, $controller, $timeout) {
    if (window.localStorage.getItem('showIntro') === null) {
        window.localStorage.setItem('showIntro', 1)
        window.location.href = "#/intro";
    }

    loaderShow();
    $scope.styleslen = jQuery(".newStyle li").length;
    $scope.url = jQuery(".newStyle li:last-child a").attr("href");
    $scope.text = jQuery(".newStyle li:last-child").text();


    $http.get(domain + "/home" + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : ""), { cache: true }).success(function(data, response, status, headers, config) {
        window.localStorage.setItem('categories', JSON.stringify(data.categories));
        $scope.imgPath = domain + "/public/admin/uploads/slider/";
        $rootScope.categories = data.categories;
        $scope.sliders = data.sliders;
        $scope.new = data.new;
        $scope.recentProduct = null;
        if ($scope.styles.length) {
            $scope.recentProduct = $scope.styles[0].id;
            $scope.styleName = $scope.styles[0].style_name;

        }
        if (window.localStorage.getItem('id') != null && $scope.recentProduct) {
            $http.get(domain + "/my-style/" + $scope.recentProduct).success(function(data, status, headers, config) {
                if (window.localStorage.getItem('back') == 1 && jQuery.parseJSON(window.localStorage.getItem("styleProducts"))) {
                    $scope.styleProducts = jQuery.parseJSON(window.localStorage.getItem("styleProducts"));
                } else { 
                $scope.styleProducts = data.data;
                window.localStorage.setItem("styleProducts", JSON.stringify($scope.styleProducts)); 
                } 
            });
        }

        $rootScope.$digest;
        loaderHide();
    });

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        siteMainFn();
    });
    $scope.$on('$viewContentLoaded', function() {
        angular.element('.drawer').css('display', 'none');
        angular.element('.open-menu1').css('display', 'none');
    });
    $scope.$on('$destroy', function() {
        angular.element('.drawer').css('display', 'block');
        angular.element('.open-menu1').css('display', 'block');

    });
});

app.controller('categoryController', function($http, $scope, $location, $rootScope, $routeParams, $anchorScroll) {

    $scope.filtered = {};
    $scope.minp = 0;
    $scope.maxp = 0;
    $scope.pdts = {};

    if (window.localStorage.getItem('back') == 1) {
        $scope.products = jQuery.parseJSON(window.localStorage.getItem("products"));
        $scope.pdts = jQuery.parseJSON(window.localStorage.getItem("pdts"));
        $scope.filters = jQuery.parseJSON(window.localStorage.getItem("filters"));
        $scope.filtered = jQuery.parseJSON(window.localStorage.getItem("filtered"));
        $scope.minp = window.localStorage.getItem("minp");
        $scope.maxp = window.localStorage.getItem("maxp");



        jQuery("#content").scrollTop(window.localStorage.getItem("scpos"))
    } else {

        loaderShow();
        $http.get(domain + "/get-category-products/" + $routeParams.url_key + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : ""), {
            cache: true
        }).success(function(data, status, headers, config) {
            $scope.products = data;
            $scope.pdts = data.data
            $scope.filters = data.filters;
            window.localStorage.setItem("pdts", JSON.stringify($scope.pdts));
            window.localStorage.setItem("filters", JSON.stringify($scope.filters));
            window.localStorage.setItem("products", JSON.stringify($scope.products));

            $scope.$digest;
            loaderHide();
        });
    }
    $scope.load = function(event, url) {
        angular.element(event.target).children("i").addClass("fa fa-spinner fa-pulse");
        $http.get(url, {
            params: {
                'filters': $scope.filtered,
                'minp': $scope.minp,
                'maxp': $scope.maxp,
                'slug': $routeParams.url_key,
                'sort': jQuery("select.orderby").val(),
                'userId': (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "")
            },
            cache: true
        }).success(function(data, status, headers, config) {
            $scope.products = data;
            if (data.data.length > 0) {
                jQuery.each(data.data, function(k, v) {
                    $scope.pdts.push(v);
                });
                window.localStorage.setItem("pdts", JSON.stringify($scope.pdts));

                angular.element(event.target).children("i").removeClass("fa fa-spinner fa-pulse");
            } else {
                angular.element(event.target).removeAttr("ng-click");
                angular.element(event.target).text("No More Products");
            }
            window.localStorage.setItem("products", JSON.stringify($scope.products));

            $scope.$digest;

            loaderHide();

        });
    };

    $scope.filterProds = function(option, parent) {
        if (option) {
            if (!(parent in $scope.filtered))
                $scope.filtered[parent] = [];

            var idx = $scope.filtered[parent].indexOf(option);

            if (idx > -1)
                $scope.filtered[parent].splice(idx, 1);
            else
                $scope.filtered[parent].push(option);

            if ($scope.filtered[parent].length <= 0)
                delete $scope.filtered[parent];
        }
    };

    $scope.applyFilters = function() {
        $scope.minp = jQuery("#min_price").val();
        $scope.maxp = jQuery("#max_price").val();

        window.localStorage.setItem("minp", $scope.minp);
        window.localStorage.setItem("maxp", $scope.maxp);
        window.localStorage.setItem("sort", jQuery("select.orderby").val());
        window.localStorage.setItem("filtered", JSON.stringify($scope.filtered));


        $http.get(domain + "/get-filtered-products", {
            params: {
                'filters': $scope.filtered,
                'minp': $scope.minp,
                'maxp': $scope.maxp,
                'slug': $routeParams.url_key,
                'sort': jQuery("select.orderby").val(),
                'userId': (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "")

            }
        }).success(function(response) {
            $scope.products = response;
            $scope.pdts = response.data
            $scope.$digest;
            window.localStorage.setItem("pdts", JSON.stringify($scope.pdts));
            window.localStorage.setItem("products", JSON.stringify($scope.products));

            jQuery(".big-notification.yellow-notification").slideUp();
        });
    }

    $scope.sizeOf = function(obj) {
        return Object.keys(obj).length;
    };

    $scope.showFilters = function() {
        jQuery(".big-notification.yellow-notification").toggle("slideDown");
        if (window.localStorage.getItem('back') == 1) {
            if (window.localStorage.getItem('filtered') != "null") {

                jQuery.each(jQuery.parseJSON(window.localStorage.getItem("filtered")), function(k, v) {
                    jQuery.each(v, function(kk, vv) {
                        jQuery("input[value=" + vv + "]").prop("checked", true);

                    });
                });
            }


        }
    }

    $scope.showOptions = function(e) {
        jQuery("#" + e).toggle();
    }

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        siteMainFn();
        jQuery(".catpage").scroll(function() {
            var scrolled_val = jQuery(".catpage").scrollTop().valueOf();
            window.localStorage.setItem("scpos", scrolled_val);

        });
        if (window.localStorage.getItem('back') == 1) {
            jQuery(".catpage").scrollTop(window.localStorage.getItem("scpos"))
            jQuery("select.orderby").val(window.localStorage.getItem("sort"));
            jQuery("[name='min_price']").val(window.localStorage.getItem("minp"));
            jQuery("[name='max_price']").val(window.localStorage.getItem("maxp"));
        }

    });


});

app.controller('searchListingController', function($http, $scope, $location, $rootScope, $routeParams, $anchorScroll) {

    $scope.filtered = {};
    $scope.minp = 0;
    $scope.maxp = 0;
    $scope.pdts = {};

    if (window.localStorage.getItem('back') == 1) {
        $scope.products = jQuery.parseJSON(window.localStorage.getItem("products2"));
        $scope.pdts = jQuery.parseJSON(window.localStorage.getItem("pdts2"));
        $scope.filters = jQuery.parseJSON(window.localStorage.getItem("filters2"));
        $scope.filtered = jQuery.parseJSON(window.localStorage.getItem("filtered2"));
        $scope.minp = window.localStorage.getItem("minp2");
        $scope.maxp = window.localStorage.getItem("maxp2");
        $scope.orderby = window.localStorage.getItem("sort2");

        jQuery("#content").scrollTop(window.localStorage.getItem("scpos2"));
    } else {

        loaderShow();
        $http.get(domain + "/search/" + $routeParams.search_key + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : ""), {
            cache: true
        }).success(function(data, status, headers, config) {
            $scope.products = data;
            $scope.pdts = data.data
            $scope.filters = data.filters;
            window.localStorage.setItem("pdts2", JSON.stringify($scope.pdts));
            window.localStorage.setItem("filters2", JSON.stringify($scope.filters));
            window.localStorage.setItem("products2", JSON.stringify($scope.products));
            window.localStorage.setItem("sort2", jQuery("select.orderby").val());
            $scope.$digest;
            loaderHide();
        });
    }
    $scope.load = function(event, url) {
        angular.element(event.target).children("i").addClass("fa fa-spinner fa-pulse");
        $http.get(url, {
            params: {
                'filters': $scope.filtered,
                'minp': $scope.minp,
                'maxp': $scope.maxp,
                'slug': $routeParams.search_key,
                'sort': jQuery("select.orderby").val(),
                'userId': (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "")
            },
            cache: true
        }).success(function(data, status, headers, config) {
            $scope.products = data;
            if (data.data.length > 0) {
                jQuery.each(data.data, function(k, v) {
                    $scope.pdts.push(v);
                });
                window.localStorage.setItem("pdts2", JSON.stringify($scope.pdts));

                angular.element(event.target).children("i").removeClass("fa fa-spinner fa-pulse");
            } else {
                angular.element(event.target).removeAttr("ng-click");
                angular.element(event.target).text("No More Products");
            }
            window.localStorage.setItem("products2", JSON.stringify($scope.products));

            $scope.$digest;

            loaderHide();

        });
    };

    $scope.filterProds = function(option, parent) {
        if (option) {
            if (!(parent in $scope.filtered))
                $scope.filtered[parent] = [];

            var idx = $scope.filtered[parent].indexOf(option);

            if (idx > -1)
                $scope.filtered[parent].splice(idx, 1);
            else
                $scope.filtered[parent].push(option);

            if ($scope.filtered[parent].length <= 0)
                delete $scope.filtered[parent];
        }
    };

    $scope.applyFilters = function() {
        $scope.minp = jQuery("#min_price").val();
        $scope.maxp = jQuery("#max_price").val();

        window.localStorage.setItem("minp2", $scope.minp);
        window.localStorage.setItem("maxp2", $scope.maxp);
        window.localStorage.setItem("sort2", jQuery("select.orderby").val());
        window.localStorage.setItem("filtered2", JSON.stringify($scope.filtered));


        $http.get(domain + "/get-search-filtered-products?", {
            params: {
                'filters': $scope.filtered,
                'minp': $scope.minp,
                'maxp': $scope.maxp,
                'slug': $routeParams.search_key,
                'sort': jQuery("select.orderby").val(),
                'userId': (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "")

            }
        }).success(function(response) {
            $scope.products = response;
            $scope.pdts = response.data
            $scope.$digest;
            window.localStorage.setItem("pdts2", JSON.stringify($scope.pdts));
            window.localStorage.setItem("products2", JSON.stringify($scope.products));

            jQuery(".big-notification.yellow-notification").slideUp();
        });
    }

    $scope.sizeOf = function(obj) {
        return Object.keys(obj).length;
    };

    $scope.showFilters = function() {
        jQuery(".big-notification.yellow-notification").toggle("slideDown");
        if (window.localStorage.getItem('back') == 1) {
            if (window.localStorage.getItem('filtered2') != "null") {

                jQuery.each(jQuery.parseJSON(window.localStorage.getItem("filtered2")), function(k, v) {
                    jQuery.each(v, function(kk, vv) {
                        jQuery("input[value=" + vv + "]").prop("checked", true);

                    });
                });
            }


        }
    }

    $scope.showOptions = function(e) {
        jQuery("#" + e).toggle();
    }

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        siteMainFn();
        jQuery(".catpage").scroll(function() {
            var scrolled_val = jQuery(".catpage").scrollTop().valueOf();
            window.localStorage.setItem("scpos2", scrolled_val);

        });
        if (window.localStorage.getItem('back') == 1) {
            jQuery(".catpage").scrollTop(window.localStorage.getItem("scpos2"))
            jQuery("select.orderby").val(window.localStorage.getItem("sort2"));
            jQuery("[name='min_price']").val(window.localStorage.getItem("minp2"));
            jQuery("[name='max_price']").val(window.localStorage.getItem("maxp2"));
        }

    });


});

app.controller('productController', function($http, $rootScope, $scope, $location, $routeParams, $timeout) {

    loaderShow();

    $http.get(domain + "/product-details/" + $routeParams.url_key + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function(data, status, headers, config) {
        $scope.product = data;
        $scope.$digest;
        loaderHide();
    });

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });
    $timeout(function() {
        siteMainFn();
    }, 2000);

    $scope.showLook = function(img) {
        promoBox({
            imagePath: 'http://stylepanache.in/public/admin/uploads/prodlooks/' + img,
            fadeInDuration: 0.33,
            fadeOutDuration: 0.2,
            loadDelay: 0
        });
    }
    $scope.showProduct = function(img) {
        promoBox({
            imagePath: img,
            fadeInDuration: 0.33,
            fadeOutDuration: 0.2,
            loadDelay: 0
        });
    }

});

app.controller('scrapbookController', function($http, $scope, $rootScope, $controller) {

    loaderShow();

    $scope.listOfOptions = ['Recent', 'Most Popular'];

    $scope.products = {};

    if (window.localStorage.getItem('back') == 1) {
        $scope.imgPath = domain + "/public/frontend/uploads/scrapbooks/";
        $scope.products = jQuery.parseJSON(window.localStorage.getItem("scrapbooks"));
        $scope.next_page_url = jQuery.parseJSON(window.localStorage.getItem("next_page_url"));
        $scope.listOfOptions = (window.localStorage.getItem("scrapbooks-sort") == 'Recent') ? ['Recent', 'Most Popular'] : ['Most Popular', 'Recent'];
        //        $scope.selectedItem = window.localStorage.getItem("scrapbooks-sort");
        jQuery("#content").scrollTop(window.localStorage.getItem("scrap-scroll"))
        loaderHide();

    } else {
        $http.get(domain + "/get-scrapbook-products" + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : ""), {
            cache: true
        }).success(function(data, status, headers, config) {
            console.log(data);
            $scope.products = data.data;
            $scope.next_page_url = data.next_page_url;
            $scope.imgPath = domain + "/public/frontend/uploads/scrapbooks/";
            window.localStorage.setItem("scrapbooks", JSON.stringify($scope.products));
            window.localStorage.setItem("scrapbooks-sort", 'Recent');

            loaderHide();
        });
    }

    $scope.load = function(event, url) {
        angular.element(event.target).children("i").addClass("fa fa-spinner fa-pulse");
        $http.get(url, {
            params: {
                'sort': (window.localStorage.getItem('scrapbooks-sort') == 'Recent' ? '' : 2),
                'userId': (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "")
            },
            cache: true
        }).success(function(data, status, headers, config) {

            if (data.data.length > 0) {
                jQuery.each(data.data, function(k, v) {
                    $scope.products.push(v);
                });

                $scope.next_page_url = data.next_page_url;

                window.localStorage.setItem("scrapbooks", JSON.stringify($scope.products));
                window.localStorage.setItem("next_page_url", JSON.stringify($scope.next_page_url));

                angular.element(event.target).children("i").removeClass("fa fa-spinner fa-pulse");
            } else {
                angular.element(event.target).removeAttr("ng-click");
                angular.element(event.target).text("No More Products");
            }

            $scope.$digest;

            loaderHide();

        });
    };

    $scope.addToSList = function(event, id) {
        if (window.localStorage.getItem('id') === null) {
            window.location.href = '#/login';
            return false;
        }

        function checkLike(event) {
            return angular.element(event).hasClass('liked');
        }
        var isLiked = checkLike(event.target);
        var likes = angular.element(event.target).children('.count').text();
        if (isLiked) {
            angular.element(event.target).removeClass("liked");
            angular.element(event.target).children('.count').text(Number(likes) - 1);
        }
        if (!isLiked) {
            angular.element(event.target).addClass("liked");
            angular.element(event.target).children('.count').text(Number(likes) + 1);
        }
        if (window.localStorage.getItem('id') != null) {
            $http.get(domain + "/scrapbook-like?productID=" + id + "&userId=" + window.localStorage.getItem('id')).success(function(response) {
                if (response == 1) {
                    angular.element(event.target).addClass("liked");
                } else {
                    angular.element(event.target).removeClass("liked");

                }

                $http.get(domain + "/get-scrapbook-products" + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function(data, status, headers, config) {
                    $scope.products = data.data;
                    $scope.$digest;
                });
            });

        }
    };


    $scope.selectedItemChanged = function() {
        loaderShow();
        if ($scope.selectedItem == 'Most Popular') {
            $http.get(domain + "/get-scrapbook-products?sort=2").success(function(data, status, headers, config) {
                $scope.products = data.data;
                $scope.next_page_url = data.next_page_url;
                console.log($scope.next_page_url);
                window.localStorage.setItem("scrapbooks", JSON.stringify($scope.products));
                window.localStorage.setItem("scrapbooks-sort", 'Most Popular');
                $scope.$digest;
                loaderHide();
            });
            //            $http.get(domain + "/sb-mp" + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function (data, status, headers, config) {
            //                $scope.products = data;
            //                window.localStorage.setItem("scrapbooks", JSON.stringify($scope.products));
            //
            //                $scope.$digest;
            //                loaderHide();
            //            });
        }

        if ($scope.selectedItem == 'Recent') {
            $http.get(domain + "/get-scrapbook-products" + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function(data, status, headers, config) {
                $scope.products = data.data;
                $scope.next_page_url = data.next_page_url;
                window.localStorage.setItem("scrapbooks", JSON.stringify($scope.products));
                window.localStorage.setItem("scrapbooks-sort", 'Recent');

                $scope.$digest;
                loaderHide();
            });
        }
        //        window.localStorage.setItem("scrapbooks-sort", JSON.stringify($scope.selectedItem));

    };

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();

    });

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        siteMainFn();
        jQuery(".catpage").scroll(function() {
            var scrolled_val = jQuery(".catpage").scrollTop().valueOf();
            window.localStorage.setItem("scrap-scroll", scrolled_val);

        });
        if (window.localStorage.getItem('back') == 1) {
            jQuery(".catpage").scrollTop(window.localStorage.getItem("scrap-scroll"))
            var str1 = "string:";
            var str2 = jQuery.parseJSON(window.localStorage.getItem("scrapbooks-sort"));
            var res = str1.concat(str2);
            jQuery('select').val(res);
        }

    });
});

app.controller('myScrapbookController', function($http, $scope, $rootScope, $controller) {

    loaderShow();

    $scope.userId = window.localStorage.getItem('id');

    $http.get(domain + "/get-myscrapbook-products" + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function(data, status, headers, config) {
        $scope.products = data;
        $scope.imgPath = domain + "/public/frontend/uploads/scrapbooks/";
        loaderHide();
    });

    $scope.addToSList = function(event, id) {
        if (window.localStorage.getItem('id') === null) {
            window.location.href = '#/login';
            return false;
        }

        function checkLike(event) {
            return angular.element(event).hasClass('liked');
        }
        var isLiked = checkLike(event.target);
        if (isLiked) {
            angular.element(event.target).removeClass("liked");
        }
        if (!isLiked) {
            angular.element(event.target).addClass("liked");
        }

        if (window.localStorage.getItem('id') != null) {
            $http.get(domain + "/scrapbook-like?productID=" + id + "&userId=" + window.localStorage.getItem('id')).success(function(response) {
                if (response == 1) {
                    angular.element(event.target).addClass("liked");

                } else {
                    angular.element(event.target).removeClass("liked");
                }
                $http.get(domain + "/get-myscrapbook-products" + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function(data, status, headers, config) {
                    $scope.products = data;
                    loaderHide();
                });

            });

        }
    };

    $scope.removeScrapbook = function(slug) {
        var r = confirm("Do you want to delete this look?");
        if (r == true) {
            loaderShow();
            jQuery.ajax({
                type: "POST",
                url: domain + "/remove-scrapbook-product",
                data: {
                    slug: slug
                },
                cache: false,
                success: function(data) {
                    if (data == 'success') {

                        $scope.$apply(function() {
                            $http.get(domain + "/get-myscrapbook-products" + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function(data, status, headers, config) {
                                $scope.products = data;
                                loaderHide();
                                toast('Look deleted');

                            });
                        });
                    } else {
                        toast('Please try again later');
                        loaderHide();

                    }
                }
            });
        }

    };

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});

app.controller('scrapbookDetailsController', function($http, $scope, $rootScope, $location, $routeParams) {
    $scope.userId = window.localStorage.getItem('id');
    loaderShow();

    $http.get(domain + "/scrapbook/" + $routeParams.url_key + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function(data, status, headers, config) {
        $scope.scrapbookproducts = data;
        $scope.imgPath = domain + "/public/frontend/uploads/scrapbooks/";
        loaderHide();
    });

    $scope.removeScrapbook = function(slug) {
        var r = confirm("Do you want to delete this look?");
        if (r == true) {
            jQuery.ajax({
                type: "POST",
                url: domain + "/remove-scrapbook-product",
                data: {
                    slug: slug
                },
                cache: false,
                success: function(data) {
                    if (data == 'success') {
                        window.location.href = "#/scrapbook";
                        toast('Look deleted');
                    } else {
                        toast('Please try again later');


                    }
                }
            });
        }
    };

    $scope.addToSList = function(event, id) {
        if (window.localStorage.getItem('id') === null) {
            window.location.href = '#/login';
            return false;
        }

        function checkLike(event) {
            return angular.element(event).hasClass('liked');
        }
        var isLiked = checkLike(event.target);
        if (isLiked) {
            angular.element(event.target).removeClass("liked");
        }
        if (!isLiked) {
            angular.element(event.target).addClass("liked");
        }

        if (window.localStorage.getItem('id') != null) {
            $http.get(domain + "/scrapbook-like?productID=" + id + "&userId=" + window.localStorage.getItem('id')).success(function(response) {
                if (response == 1) {
                    angular.element(event.target).addClass("liked");

                } else {
                    angular.element(event.target).removeClass("liked");
                }

                $http.get(domain + "/scrapbook/" + $routeParams.url_key + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function(data, status, headers, config) {
                    $scope.scrapbookproducts = data;
                    $scope.$digest;
                    loaderHide();
                });
            });

        }
    };

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});

app.controller('loginController', function($http, $rootScope, $location, $scope, $routeParams) {
    if (window.localStorage.getItem('id') != null) {
        window.location.href = "#/";
        return false;
    }
    jQuery(".selectStyle").hide();
    loaderHide();
    $scope.rurl = $routeParams.rurl;
    $scope.login = function() {
        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
        document.getElementById('emailError').innerHTML = '';
        document.getElementById('pwdError').innerHTML = '';
        if (document.loginuser.useremail.value === '') {
            document.getElementById('emailError').innerHTML = 'Email is Required';
            document.getElementById('useremail').focus();
            return false;
        }
        if (document.loginuser.useremail.value != '') {
            if (!validateEmail(document.loginuser.useremail.value)) {
                document.getElementById('emailError').innerHTML = 'Email is not valid';
                document.getElementById('useremail').focus();
                return false;
            }
        }

        if (document.loginuser.password.value === '') {
            document.getElementById('pwdError').innerHTML = 'Password is Required';
            document.getElementById('password').focus();
            return false;
        }
        loaderShow();
        jQuery.ajax({
            type: "POST",
            url: domain + "/check-user",
            data: jQuery("#loginuser").serialize(),
            cache: false,
            success: function(data) {
                loaderHide();
                if (data[0] == "invalid") {
                    $rootScope.loggedIn = 0;
                    toast("Invalid login");
                } else if (data[0] == "empty") {
                    $rootScope.loggedIn = 0;
                    toast("Please enter username and password!");
                } else {
                    $rootScope.loggedIn = 1;
                    window.localStorage.setItem('id', data.id);
                    window.localStorage.setItem('name', data.first_name);
                    window.localStorage.setItem('email', data.email);
                    window.localStorage.setItem('member', data.is_member);
                    window.localStorage.setItem('prefs', JSON.stringify(data.preferences));

                    try {
                        window.localStorage.setItem('department', data.department.name);

                    } catch (err) {
                        console.log(err);
                    }
                    $scope.$apply(function() {
                        $scope.preferences = data.preferences;
                    });

                    $rootScope.$apply(function() {
                        $rootScope.styles = data.preferences;
                    });
                    $rootScope.$digest;
                    jQuery(".login").hide();
                    jQuery(".selectStyle").show();
                }
            }
        });
    };

    $scope.setPreference = function() {

        loaderShow();


        window.location.href = "#/add-new-style";

    };

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });
});

app.controller('bodyCharacteristicsController', function($http, $scope, $rootScope, $location, $timeout) {

    loaderShow();

    $scope.userId = window.localStorage.getItem('id');
    $scope.parameters = 0;

    if (window.localStorage.getItem('id') !== null) {
        $http.get(domain + "/get-user-details?userId=" + window.localStorage.getItem('id')).success(function(data, response, status, headers, config) {
            $scope.stylerEmail = data.email;
        });
    } else {
        $scope.stylerEmail = '';
    }

    $http.get(domain + '/body-characteristics').success(function(data, response, status, headers, config) {
        $scope.categories = data;

        angular.forEach(data, function() {
            $scope.parameters++;
        });

        $scope.imgPath = domain + "/public/admin/uploads/catalog/category/";
        loaderHide();
    });
    $scope.getGender = 'female';
    $scope.activePanelFn = function(tab) {
        $scope.getGender = tab;
    };
    $scope.getGallery = function(event) {
        if (jQuery(event.target).hasClass('responsive-image')) {
            var vm = jQuery(event.target).parent('a');
        }
        if (jQuery(event.target).hasClass('lbl-style')) {
            var vm = jQuery(event.target).parent().parent('a');
        }
        if (jQuery(event.target).hasClass('to-cat-select')) {
            var vm = event.target;
        }

        jQuery(vm).closest("div.child").find(".item-selected").removeClass("item-selected");
        jQuery(vm).addClass("item-selected").prev(":radio").click();



    };



    $scope.addPref = function() {
        var Ffrm = jQuery("[type='radio']").serialize();
        var arr = Ffrm.split('&');

        if (arr.length != 0 && arr.length < $scope.parameters) {
            toast("Please select all style parameters!");
            return false;
        }

        loaderShow();
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-style-preference?userId=" + window.localStorage.getItem('id'),
            data: jQuery("[name='addStyleForm']").serialize(),
            cache: false,
            success: function(data) {
                console.log(data);
                if (data[0] == 'registered') {
                    toast('Entered email is already present, kindly login or enter another id!');
                    loaderHide();
                    //                    window.location.href = "#/add-new-style";
                } else if (data[0] != 'registered') {
                    jQuery('<li><a ng-href="#/explore-style/' + data.id + '" class="active-menu"><i class="fa fa-angle-right"></i>' + data.style_name + '<i class="fa fa-circle"></i></a></li>').insertAfter(jQuery(".newStyle li:nth-child(1)"));
                    var prefs = jQuery.parseJSON(window.localStorage.getItem('prefs'));
                    if (prefs != null)
                        prefs.unshift(data);
                    window.localStorage.setItem('prefs', JSON.stringify(prefs));
                    window.location.href = "#/explore-style/" + data.id;
                }
            }
        });
    };

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});

app.controller('addWardrobeController', function($http, $scope, $rootScope, $location) {

    loaderShow();

    $http.get(domain + "/get-wardrobe-category").success(function(data, status, headers, config) {
        $scope.wardrobecats = data;
        $scope.userId = window.localStorage.getItem('id');
        $scope.$digest;
        loaderHide();
    });

    $scope.addWardrobePref = function() {
        var data = new FormData(jQuery("[name='wardrobefrm']")[0]);
        loaderShow();
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-wardrobe-preference",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                window.location.href = "#/wardrobe";
            }
        });
    };

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});

app.controller('wardrobeController', function($http, $scope, $rootScope, $location, $routeParams) {

    loaderShow();

    $http.get(domain + "/get-wardrobe-products?userId=" + window.localStorage.getItem('id')).success(function(data, status, headers, config) {
        $scope.name = window.localStorage.getItem('name');
        $scope.wardrobeprods = data;
        window.localStorage.setItem('wardrobeprods', JSON.stringify(data));
        loaderHide();
    });

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});

app.controller('travelPlannerController', function($http, $scope, $rootScope, $location, $routeParams) {

    $scope.submitPTFrm = function() {
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-travel-plan?userId=" + window.localStorage.getItem('id'),
            data: jQuery("#planTravelFrm").serialize(),
            cache: false,
            success: function(data) {
                if (data == "saved") {
                    alert("Thanks, our Stylist will review your details and suggest products that would be apt for your travel!");
                    window.location.href = "#/";
                }
            }
        });
    };

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });
});

app.controller('wardrobeListingController', function($http, $scope, $rootScope, $location, $routeParams, $filter) {

    loaderShow();
    $scope.imgPath = domain + "/public/frontend/uploads/wardrobes/";
    $scope.wardrobeList = $filter('filter')(jQuery.parseJSON(window.localStorage.getItem('wardrobeprods')), {
        id: $routeParams.id
    })[0];
    loaderHide();

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });


    $scope.removeWardrobeProduct = function(id) {
        var r = confirm("Do you want to delete this item?");
        if (r == true) {
            jQuery.ajax({
                type: "POST",
                url: domain + "/delete-wardrobe-product",
                data: {
                    id: id
                },
                cache: false,
                success: function(data) {
                    if (data == 'success') {
                        window.location.href = "#/wardrobe";
                    } else {
                        toast('Looks like something went wrong... Please try again later');
                    }

                }
            });
        }
    };
});

app.controller('createScrapbookController', function($http, $scope, $rootScope, $location) {
    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });


    $scope.userId = window.localStorage.getItem('id');

    $scope.autoCompleteFn = function() {
        var $ = jQuery;

        function log(message) {
            $("<div>").html(message).prependTo("#log");
            $("#pdcts").val("");
            $("#log").scrollTop(0);

        }

        $products = $("#pdcts");

        $products.autocomplete({
            source: domain + "/search-products",
            minLength: 2,
            select: function(event, ui) {
                log(ui.item ?
                    " <img  style='vertical-align: middle; margin-bottom: 5px; width:60px; display:inline' src='" + (ui.item.large_image != '' ? ui.item.large_image : (ui.item.medium_image != '' ? ui.item.medium_image : ui.item.small_image)) + "'><span style='display:inline'>" + ui.item.label + "</span><input type='hidden' name='pid[]' value='" + ui.item.id + "' ><a href='#' style='display:inline; margin-left:15px' class='  remove-rag'  ><i class='fa fa-trash'></i></a>" : "");
                jQuery("#pdcts").val('');
                return false;
            }
        });

        $products.data("ui-autocomplete")._renderItem = function(ul, item) {
            return $("<li>")
                .append("<a><div class='inline-autocom'><img style='width:60px' src='" + (item.large_image != '' ? item.large_image : (item.medium_image != '' ? item.medium_image : item.small_image)) + "'> </div><div class='inline-autocom'>" + item.label + "</div></a>")
                .appendTo(ul);
        };
    };

    $http.get(domain + "/get-scrapbook-products").success(function(data, status, headers, config) {
        $scope.scrapbookprods = data;
    });

    $scope.addScrapbook = function() {
        loaderShow();
        var data = new FormData(jQuery("[name='scrapbookfrm']")[0]);
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-scrapbook",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                toast("Thank you for Expressing your Look. It will be published to all once our Admin team approves it!");
                window.location.href = "#/scrapbook";
            }
        });
    };

    loaderHide();


});

app.controller('chatController', function($http, $scope, $rootScope, $controller) {
    $scope.ismember = window.localStorage.getItem('member');
    loaderHide();
    $scope.openDialer = function() {
        window.open('tel:08692040777', '_system');
    };
    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});

app.controller('questionnaireController', function($http, $scope, $rootScope, $controller) {

    loaderHide();

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

    $scope.submitAns = function() {
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-questionnaire?userId=" + window.localStorage.getItem('id'),
            data: jQuery("#questionnairefrm").serialize(),
            cache: false,
            success: function(data) {
                if (data == "saved") {

                    var data1 = jQuery("#cell_number").val();
                    console.log(data1);
                    jQuery.ajax({
                        type: "POST",
                        url: domain + "/update-user-phone?userId=" + window.localStorage.getItem('id') + "&" + "user_phone=" + data1,
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(data) {
                            if (data[0] == "success") {
                                console.log('cell updated');
                            }

                        }
                    });

                    jQuery.get(domain + "/update-membership?userId=" + window.localStorage.getItem('id')).success(function(data, status, headers, config) {
                        window.localStorage.setItem('department', data[0]);
                        window.localStorage.setItem('member', 1);
                        toast("Congratulations, you are an esteemed Style Panache member now!");
                        window.location.href = "#/chat";
                    });

                    //                    window.open("http://sp.boxcommerce.in/personal-chat.php?name=" + window.localStorage.getItem("name") + "&email=" + window.localStorage.getItem("email") + "&dep=" + window.localStorage.getItem("department"), '_blank', 'EnableViewPortScale=yes,location=no,closebuttoncaption=Close');
                }
            }
        });
    };

});

app.controller('logoutController', function($http, $rootScope, $location, $scope) {
    loaderHide();
    $rootScope.cartCnt = "";
    $rootScope.loggedIn = 0;
    $rootScope.$digest;
    localStorage.clear();
    window.localStorage.setItem('showIntro', 1);
    window.localStorage.setItem('cart', JSON.stringify([]));
    window.location.href = "#/";


    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });
});

app.controller('myStyleController', function($http, $scope, $location, $rootScope, $routeParams) {

    loaderShow();
    $scope.filtered = {};
    $scope.minp = 0;
    $scope.maxp = 0;

    $scope.pdts = {};
    if (window.localStorage.getItem('back') == 1) {
        $scope.products = jQuery.parseJSON(window.localStorage.getItem("ms-products"));
        $scope.pdts = jQuery.parseJSON(window.localStorage.getItem("ms-pdts"));
        $scope.filters = jQuery.parseJSON(window.localStorage.getItem("ms-filters"));
        $scope.styleid = jQuery.parseJSON(window.localStorage.getItem("ms-styleid"));


        $scope.filtered = jQuery.parseJSON(window.localStorage.getItem("ms-filtered"));
        $scope.minp = window.localStorage.getItem("ms-minp");
        $scope.maxp = window.localStorage.getItem("ms-maxp");
        jQuery("#content").scrollTop(window.localStorage.getItem("scpos"))
        loaderHide();
    } else {

        $http.get(domain + "/my-style/" + $routeParams.url_key, {
            'userId': (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "")
        }).success(function(data, status, headers, config) {
            $scope.products = data;
            $scope.styleid = $routeParams.url_key;
            $scope.pdts = data.data
            $scope.filters = data.filters;
            window.localStorage.setItem("ms-pdts", JSON.stringify($scope.pdts));
            window.localStorage.setItem("ms-filters", JSON.stringify($scope.filters));
            window.localStorage.setItem("ms-products", JSON.stringify($scope.products));
            window.localStorage.setItem("ms-styleid", JSON.stringify($scope.styleid));

            $scope.$digest;
            loaderHide();
        });
    }
    $scope.removeUserStyle = function(id) {
        var pid = id;
        var r = confirm("Do you want to delete this Style Profile?");
        if (r == true) {
            jQuery.ajax({
                type: "POST",
                url: domain + "/remove-user-style",
                data: {
                    id: id
                },
                cache: false,
                success: function(data) {
                    if (data == 'success') {
                        var prefs = jQuery.parseJSON(window.localStorage.getItem('prefs'));
                        prefs = prefs.filter(function(el) {
                            return el.id !== parseInt(pid);
                        });


                        $rootScope.$apply(function() {
                            $rootScope.styles = prefs;
                        });

                        window.localStorage.setItem('prefs', JSON.stringify(prefs));

                        window.location.href = "#/";

                    } else {
                        alert('Please try again later');
                    }
                }
            });
        }
    };

    $scope.load = function(event, url) {
        angular.element(event.target).children("i").addClass("fa fa-spinner fa-pulse");
        $http.get(url, {
            params: {
                'filters': $scope.filtered,
                'minp': $scope.minp,
                'maxp': $scope.maxp,
                'slug': $routeParams.url_key,
                'sort': jQuery("select.orderby").val(),
                'userId': (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "")
            }
        }).success(function(data, status, headers, config) {
            $scope.products = data;
            if (data.data.length > 0) {
                jQuery.each(data.data, function(k, v) {
                    $scope.pdts.push(v);
                });
                window.localStorage.setItem("ms-pdts", JSON.stringify($scope.pdts));

                angular.element(event.target).children("i").removeClass("fa fa-spinner fa-pulse");
            } else {
                angular.element(event.target).removeAttr("ng-click");
                angular.element(event.target).text("No More Products");
            }
            window.localStorage.setItem("ms-products", JSON.stringify($scope.products));

            $scope.$digest;

            loaderHide();

        });
    };



    $scope.filterProds = function(option, parent) {
        if (option) {
            if (!(parent in $scope.filtered))
                $scope.filtered[parent] = [];

            var idx = $scope.filtered[parent].indexOf(option);

            if (idx > -1)
                $scope.filtered[parent].splice(idx, 1);
            else
                $scope.filtered[parent].push(option);

            if ($scope.filtered[parent].length <= 0)
                delete $scope.filtered[parent];
        }
    };

    $scope.priceFilter = function() {

    };

    $scope.applyFilters = function() {
        $scope.minp = jQuery("#min_price").val();
        $scope.maxp = jQuery("#max_price").val();

        window.localStorage.setItem("ms-minp", $scope.minp);
        window.localStorage.setItem("ms-maxp", $scope.maxp);
        window.localStorage.setItem("ms-sort", jQuery("select.orderby").val());
        window.localStorage.setItem("ms-filtered", JSON.stringify($scope.filtered));

        $http.get(domain + "/my-style/" + $routeParams.url_key, {
            params: {
                'filters': $scope.filtered,
                'minp': $scope.minp,
                'maxp': $scope.maxp,
                'sort': jQuery("select.orderby").val(),
                'userId': (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "")
            }
        }).success(function(response) {
            $scope.products = response;
            $scope.pdts = response.data
            $scope.$digest;

            window.localStorage.setItem("ms-pdts", JSON.stringify($scope.pdts));
            window.localStorage.setItem("ms-products", JSON.stringify($scope.products));
            jQuery(".big-notification.yellow-notification").toggle("slideDown");
        });
    }

    $scope.sizeOf = function(obj) {
        return Object.keys(obj).length;
    };

    $scope.showFilters = function() {
        if (window.localStorage.getItem('back') == 1) {
            if (window.localStorage.getItem('ms-filtered') != "null") {
                jQuery.each(jQuery.parseJSON(window.localStorage.getItem("ms-filtered")), function(k, v) {
                    jQuery.each(v, function(kk, vv) {
                        jQuery("input[value=" + vv + "]").prop("checked", true);

                    });
                });
            }
        }

        jQuery(".big-notification.yellow-notification").toggle("slideDown");

    }

    $scope.showOptions = function(e) {
        jQuery("#" + e).toggle();
    }
    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });
    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        siteMainFn();
        jQuery(".catpage").scroll(function() {
            var scrolled_val = jQuery(".catpage").scrollTop().valueOf();
            window.localStorage.setItem("ms-scpos", scrolled_val);

        });
        if (window.localStorage.getItem('back') == 1) {
            jQuery(".catpage").scrollTop(window.localStorage.getItem("ms-scpos"))
            jQuery("select.orderby").val(window.localStorage.getItem("ms-sort"));
            jQuery("[name='min_price']").val(window.localStorage.getItem("ms-minp"));
            jQuery("[name='max_price']").val(window.localStorage.getItem("ms-maxp"));
        }

    });
});

app.controller('signupController', function($http, $scope, $location, $rootScope, $routeParams) {

    loaderHide();

    $scope.signup = function() {
        jQuery('.signup-error').empty();

        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
        if (document.log.fname.value === '') {
            document.getElementById('fname').innerHTML = 'First name is required';
            document.getElementById('firstName').focus();
            return false;
        }
        if (document.log.lname.value === '') {
            document.getElementById('Lname').innerHTML = 'Last name is required';
            document.getElementById('lastName').focus();
            return false;
        }
        if (document.log.email.value === '') {
            document.getElementById('emailError').innerHTML = 'Email is required';
            document.getElementById('emailTxt').focus();
            return false;
        }
        if (document.log.email.value != '') {
            if (!validateEmail(document.log.email.value)) {
                document.getElementById('emailError').innerHTML = 'Email is not valid';
                document.getElementById('emailTxt').focus();
                return false;
            }
        }
        if (document.log.password.value === '') {
            document.getElementById('PwdError').innerHTML = 'Password is required';
            document.getElementById('password').focus();
            return false;
        }
        if (document.log.password.value.length < 6) {
            document.getElementById('PwdError').innerHTML = 'Password should contain atleast 6 characters';
            document.getElementById('password').focus();
            return false;
        }
        if (document.log.repassword.value === '') {
            document.getElementById('confirmPwdError').innerHTML = 'Confirm password is required';
            document.getElementById('repassword').focus();
            return false;
        }
        if (document.log.repassword.value !== document.log.password.value) {
            document.getElementById('confirmPwdError').innerHTML = 'Password and confirm password should same';
            document.getElementById('repassword').focus();
            return false;
        }
        if (document.log.phone.value === '') {
            document.getElementById('phoneError').innerHTML = 'Phone is required';
            document.getElementById('phone-singup').focus();
            return false;
        }

        loaderShow();



        var data = new FormData(jQuery("#signup")[0]);
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-reg",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                if (data == "register") {
                    toast("Email is already registered");
                } else if (data[0] == "registered") {
                    toast("Email is already registered! Please use different email");
                } else {
                    toast("Signup Successfull");
                    window.location.href = "#/login";
                }
            }
        });


    }

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});

app.controller('cartController', function($http, $scope, $location, $rootScope, $timeout, $routeParams) {

    loaderShow();

    $scope.cart = jQuery.parseJSON(window.localStorage.getItem("cart"));
    $scope.cart.Total = 0;
    jQuery.each(jQuery.parseJSON(window.localStorage.getItem("cart")), function(k, v) {
        $scope.cart.Total += parseInt(v.spl_price > 0 && v.spl_price < v.price ? v.spl_price : v.price);
    });

    $scope.openStoreLink = function(product) {
        window.open(product.url, "_system");
    };


    $scope.delete = function(e, p) {

        var cart = jQuery.parseJSON(window.localStorage.getItem("cart"));

        cart = jQuery.grep(cart, function(n, i) {
            return (n.id != p)
        });

        $rootScope.cartCnt = cart.length > 0 ? cart.length : "";

        window.localStorage.setItem("cart", JSON.stringify(cart));

        $scope.cart = cart;
        $scope.cart.Total = 0;
        jQuery.each(jQuery.parseJSON(window.localStorage.getItem("cart")), function(k, v) {
            $scope.cart.Total += parseInt(v.spl_price > 0 && v.spl_price < v.price ? v.spl_price : v.price);
        });

    }

    loaderHide();
    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });
    $timeout(function() {
        siteMainFn();
    }, 2000);

});

app.controller('contactController', function($http, $scope, $location, $rootScope, $routeParams) {

    loaderHide();
    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });


    $scope.submitContact = function() {
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-contact",
            data: jQuery("#contactForm").serialize(),
            cache: false,
            success: function(data) {
                if (data == "sent") {
                    toast("Thank you! We will get back to you shortly.");

                    window.location.href = "#/";
                }
            }
        });
    };

});

app.controller('userDashboardController', function($http, $scope, $location, $rootScope, $routeParams) {
    $scope.userId = window.localStorage.getItem('id');

    loaderShow();
    $http.get(domain + "/get-user-details?userId=" + window.localStorage.getItem('id')).success(function(data, status, headers, config) {
        $scope.userDetails = data;
        $scope.$digest;
        loaderHide();
    });

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

    $scope.updateUDetails = function() {

        loaderShow();
        var data = new FormData(jQuery("#userDetailsfrm")[0]);
        jQuery.ajax({
            type: "POST",
            url: domain + "/update-user-details",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            success: function(data) {
                if (data[0] == "success") {
                    toast("Profile updated successfully!");
                    window.location.href = "#/profile";
                    loaderHide();
                } else
                    toast("Looks like something went wrong... Please try again later!");
                loaderHide();
                window.location.href = "#/profile";
            }
        });

    };

});

app.controller('favoritesController', function($http, $scope, $location, $rootScope, $routeParams) {
    $scope.userId = window.localStorage.getItem('id');

    loaderShow();

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });


    $http.get(domain + "/wish-list-products?userId=" + window.localStorage.getItem('id')).success(function(data, status, headers, config) {
        $scope.userFavorites = data;
        $scope.$digest;
        loaderHide();
    });
});

app.controller('commonController', function($http, $scope, $location, $rootScope, $routeParams, $timeout) {

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

    $scope.chkLogin = function() {
        window.location.href = "#/login?rurl=define-style";
    }

});

app.controller('introController', function($http, $scope, $location, $rootScope, $routeParams) {
    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});

app.controller('userProfileController', function($http, $scope, $location, $rootScope, $routeParams) {

    loaderShow();

    $scope.userId = (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "");
    $scope.totalSPLikes = 0;

    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

    $http.get(domain + "/user-profile?uid=" + $routeParams.id + "&userId=" + (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "")).success(function(data, status, headers, config) {
        $scope.profile = data;
        console.log(data);
        angular.forEach(data.scrapbooks, function(value1, key1) {
            $scope.totalSPLikes = $scope.totalSPLikes + value1.scrapbooklikes.length;
        });
        $scope.$digest;
        loaderHide();
    });

    $http.get(domain + "/get-userscrapbook-products?uid=" + $routeParams.id + "&userId=" + (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "")).success(function(data, status, headers, config) {
        $scope.sbproducts = data;
        console.log(data);
        $scope.imgPath = domain + "/public/frontend/uploads/scrapbooks/";
        loaderHide();
    });

    $scope.followme = function(event, id) {
        if (window.localStorage.getItem('id') === null) {
            window.location.href = '#/login';
            return false;
        }

        //        $http.get(domain + "/user-follow?followerID=" + (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "") + "&userId=" + id).success(function (response) {
        $http.get(domain + "/user-follow?userId=" + (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "") + "&uid=" + id).success(function(response) {

            $http.get(domain + "/user-profile?userId=" + (window.localStorage.getItem('id') != null ? window.localStorage.getItem('id') : "") + "&uid=" + id).success(function(data, status, headers, config) {
                $scope.profile = data;
                $scope.totalSPLikes = 0;

                angular.forEach(data.scrapbooks, function(value1, key1) {
                    $scope.totalSPLikes = $scope.totalSPLikes + value1.scrapbooklikes.length;
                });

                if (response == 1) {
                    angular.element(event.target).text("Following");
                } else {
                    angular.element(event.target).text("Follow");
                }

                $scope.$digest;
                loaderHide();
            });

            //            $scope.totalSPLikes = 0;
        });
    };

    $scope.addToSList = function(event, id) {
        if (window.localStorage.getItem('id') === null) {
            window.location.href = '#/login';
            return false;
        }

        function checkLike(event) {
            return angular.element(event).hasClass('liked');
        }
        var isLiked = checkLike(event.target);
        var likes = angular.element(event.target).children('.count').text();
        if (isLiked) {
            angular.element(event.target).removeClass("liked");
            angular.element(event.target).children('.count').text(Number(likes) - 1);
        }
        if (!isLiked) {
            angular.element(event.target).addClass("liked");
            angular.element(event.target).children('.count').text(Number(likes) + 1);
        }
        if (window.localStorage.getItem('id') != null) {
            $http.get(domain + "/scrapbook-like?productID=" + id + (window.localStorage.getItem('id') != null ? "&userId=" + window.localStorage.getItem('id') : "")).success(function(response) {
                if (response == 1) {
                    angular.element(event.target).addClass("liked");
                } else {
                    angular.element(event.target).removeClass("liked");
                }

                $http.get(domain + "/get-userscrapbook-products?uid=" + $routeParams.id + (window.localStorage.getItem('id') != null ? "&userId=" + window.localStorage.getItem('id') : "")).success(function(data, status, headers, config) {
                    $scope.sbproducts = data;
                    $scope.imgPath = domain + "/public/frontend/uploads/scrapbooks/";
                    $scope.$digest;
                });
            });
        }

    };

});

app.controller('subcatController', function($http, $scope, $location, $rootScope, $routeParams) {
    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });


    loaderShow();
    $http.get(domain + "/subcat/" + $routeParams.id).success(function(data, status, headers, config) {
        $scope.imgPath = domain + "/public/admin/uploads/catalog/category/";
        $scope.cat = data;
        $scope.$digest;
        loaderHide();
    });
});
app.controller('offerController', function($http, $scope, $location, $rootScope, $routeParams) {

    loaderShow();

    $http.get(domain + "/get-offers").success(function(data, status, headers, config) {
        $scope.offers = data;
        loaderHide();
    });
    $scope.$on('$viewContentLoaded', function() {
        siteMainFn();
    });

});
app.run(function($window, $rootScope) {
    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function() {
        $rootScope.$apply(function() {
            $rootScope.online = false;
        });
    }, false);
    $window.addEventListener("online", function() {
        $rootScope.$apply(function() {
            $rootScope.online = true;
        });
    }, false);
});
