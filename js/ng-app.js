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

    $http.get(domain + "/home" + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function (data, response, status, headers, config) {
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
    $scope.filtered = {};
    $scope.minp = 0;
    $scope.maxp = 0;

    $http.get(domain + "/get-category-products/" + $routeParams.url_key + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function (data, status, headers, config) {
        $scope.products = data;
        $scope.filters = data.filters;
        $scope.$digest;
        loaderHide();
    });

    $scope.load = function (url) {
        loaderShow();
        $http.get(url, {
            params: {
                'filters': $scope.filtered,
                'minp': $scope.minp,
                'maxp': $scope.maxp
            }
        }).success(function (data, status, headers, config) {
            $scope.products = data;
            $scope.$digest;
            loaderHide();
        });
        $anchorScroll();
    };

    $scope.filterProds = function (option, parent) {
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

    $scope.applyFilters = function () {
        $scope.minp = jQuery("#min_price").val();
        $scope.maxp = jQuery("#max_price").val();

        console.log(jQuery("#min_price").val());

        $http.get(domain + "/get-filtered-products", {
            params: {
                'filters': $scope.filtered,
                'minp': $scope.minp,
                'maxp': $scope.maxp
            }
        }).success(function (response) {
            console.log(response);
            $scope.products = response;
            $scope.$digest;
            jQuery(".big-notification.yellow-notification").toggle("slideDown");
        });
    }

    $scope.sizeOf = function (obj) {
        return Object.keys(obj).length;
    };

    $scope.showFilters = function () {
        jQuery(".big-notification.yellow-notification").toggle("slideDown");
    }

    $scope.showOptions = function (e) {
        jQuery("#" + e).toggle();
    }

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

});

app.controller('productController', function ($http, $rootScope, $scope, $location, $routeParams) {

    loaderShow();

    $http.get(domain + "/product-details/" + $routeParams.url_key + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function (data, status, headers, config) {
        $scope.product = data;
        console.log(data);
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

    $scope.listOfOptions = ['Most Popular', 'Most Recent'];

    $scope.selectedItemChanged = function () {
        console.log('You selected ' + $scope.selectedItem);

        if ($scope.selectedItem == 'Most Popular') {
            $http.get(domain + "/sb-mp").success(function (data, status, headers, config) {
                $scope.products = data;
                console.log(data);
                $scope.$digest;
                loaderHide();
            });
        }
    };

    $scope.removeScrapbook = function (slug) {
        var r = confirm("Do you want to delete this item!");
        if (r == true) {
            jQuery.ajax({
                type: "POST",
                url: domain + "/remove-scrapbook-product",
                data: {
                    slug: slug
                },
                cache: false,
                success: function (data) {
                    console.log(data);
                    if (data == 'success') {
                        window.location.href = "#/";
                    } else {
                        toast('Please try again later');


                    }
                }
            });
        }
    };

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

});

app.controller('myScrapbookController', function ($http, $scope, $rootScope, $controller) {

    loaderShow();

    $scope.userId = window.localStorage.getItem('id');

    $http.get(domain + "/get-myscrapbook-products" + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function (data, status, headers, config) {
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

    $http.get(domain + "/scrapbook/" + $routeParams.url_key + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function (data, status, headers, config) {
        $scope.scrapbookproducts = data;
        console.log(data);
        $scope.imgPath = domain + "/public/frontend/uploads/scrapbooks/";
        loaderHide();
    });

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
});

app.controller('loginController', function ($http, $rootScope, $location, $scope, $routeParams) {
    jQuery(".selectStyle").hide();

    loaderHide();

    $scope.rurl = $routeParams.rurl;

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
                    toast("Invalid login");
                } else {
                    $rootScope.loggedIn = 1;
                    window.localStorage.setItem('id', data.id);
                    window.localStorage.setItem('name', data.first_name);
                    window.localStorage.setItem('email', data.email);
                    window.localStorage.setItem('member', data.is_member);
                    try {
                        window.localStorage.setItem('department', data.department.name);

                    } catch (err) {
                        console.log(err);
                    }
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
    $scope.getGallery = function () {

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
        console.log(JSON.stringify(data));
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
    $scope.wardrobeList = $filter('filter')(jQuery.parseJSON(window.localStorage.getItem('wardrobeprods')), {
        id: $routeParams.id
    })[0];
    console.log($scope.wardrobeList);
    loaderHide();

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });

    $scope.removeWardrobeProduct = function (id) {
        var r = confirm("Do you want to delete this item!");
        if (r == true) {
            jQuery.ajax({
                type: "POST",
                url: domain + "/delete-wardrobe-product",
                data: {
                    id: id
                },
                cache: false,
                success: function (data) {
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

app.controller('createScrapbookController', function ($http, $scope, $rootScope, $location) {
    $scope.userId = window.localStorage.getItem('id');

    $scope.autoCompleteFn = function () {
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
            select: function (event, ui) {
             
                log(ui.item ?
                    " <img  style='vertical-align: middle; margin-bottom: 5px; width:60px; display:inline' src='" + (ui.item.large_image != '' ? ui.item.large_image : (ui.item.medium_image != '' ? ui.item.medium_image : ui.item.small_image)) + "'><span style='display:inline'>" + ui.item.label + "</span><input type='hidden' name='pid[]' value='" + ui.item.id + "' ><a href='#' style='display:inline; margin-left:15px' class='  remove-rag'  ><i class='fa fa-trash'></i></a>" : "");
            }

        });

        $products.data("ui-autocomplete")._renderItem = function (ul, item) {
             
            return $("<li>")
            .append("<a><div class='inline-autocom'><img style='width:60px' src='" + (item.large_image != '' ? item.large_image : (item.medium_image != '' ? item.medium_image : item.small_image)) + "'> </div><div class='inline-autocom'>" + item.label + "</div></a>")
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
    $scope.ismember = window.localStorage.getItem('member');
    console.log(window.localStorage.getItem('member'));
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

    $scope.submitAns = function () {
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-questionnaire?userId=" + window.localStorage.getItem('id'),
            data: jQuery("#questionnairefrm input").serialize(),
            cache: false,
            success: function (data) {
                if (data == "saved") {

                    jQuery.get(domain + "/update-membership?userId=" + window.localStorage.getItem('id')).success(function (data, status, headers, config) {
                        console.log(data[0]);
                        window.localStorage.setItem('department', data[0]);
                        window.localStorage.setItem('member', 1);
                        window.location.href = "#/chat";
                    });

//                    window.open("http://sp.boxcommerce.in/personal-chat.php?name=" + window.localStorage.getItem("name") + "&email=" + window.localStorage.getItem("email") + "&dep=" + window.localStorage.getItem("department"), '_blank', 'EnableViewPortScale=yes,location=no,closebuttoncaption=Close');
                }
            }
        });
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
        console.log(data);
        $scope.filters = data.filters;
        $scope.$digest;
        loaderHide();
    });



    $scope.filtered = {};
    $scope.minp = 0;
    $scope.maxp = 0;


    $scope.load = function (url) {
        loaderShow();
        $http.get(url, {
            params: {
                'filters': $scope.filtered,
                'minp': $scope.minp,
                'maxp': $scope.maxp
            }
        }).success(function (data, status, headers, config) {
            $scope.products = data;
            $scope.$digest;
            loaderHide();
        });
    };


    $scope.filterProds = function (option, parent) {
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

    $scope.priceFilter = function () {

    };

    $scope.applyFilters = function () {
        $scope.minp = jQuery("#min_price").val();
        $scope.maxp = jQuery("#max_price").val();

        $http.get(domain + "/my-style/" + $routeParams.url_key, {
            params: {
                'filters': $scope.filtered,
                'minp': $scope.minp,
                'maxp': $scope.maxp
            }
        }).success(function (response) {
            $scope.products = response;
            $scope.$digest;
            jQuery(".big-notification.yellow-notification").toggle("slideDown");
        });
    }

    $scope.sizeOf = function (obj) {
        return Object.keys(obj).length;
    };

    $scope.showFilters = function () {
        jQuery(".big-notification.yellow-notification").toggle("slideDown");
    }

    $scope.showOptions = function (e) {
        jQuery("#" + e).toggle();
    }



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
                    toast("Email is already registered.");
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
        $scope.cart.Total += parseInt(v.spl_price > 0 && v.spl_price < v.price ? v.spl_price : v.price);
    });

    $scope.delete = function (e, p) {

        var cart = jQuery.parseJSON(window.localStorage.getItem("cart"));

        cart = jQuery.grep(cart, function (n, i) {
            return (n.id != p)
        });


        window.localStorage.setItem("cart", JSON.stringify(cart));

        $scope.cart = cart;
        $scope.cart.Total = 0;
        jQuery.each(jQuery.parseJSON(window.localStorage.getItem("cart")), function (k, v) {
            $scope.cart.Total += parseInt(v.spl_price > 0 && v.spl_price < v.price ? v.spl_price : v.price);
        });

    }

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

    $scope.submitContact = function () {
        jQuery.ajax({
            type: "POST",
            url: domain + "/save-contact",
            data: jQuery("#contactForm").serialize(),
            cache: false,
            success: function (data) {
                console.log(data);

                if (data == "sent") {
                    toast("Thank you! We will get back to you shortly.");

                    window.location.href = "#/";
                }
            }
        });
    };

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
                if (data[0] == "success")
                    toast("Profile updated successfully!");
                else
                    toast("Looks like something went wrong... Please try again later!");

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

app.controller('commonController', function ($http, $scope, $location, $rootScope, $routeParams) {

    $scope.$on('$viewContentLoaded', function () {
        siteMainFn();
    });
});
