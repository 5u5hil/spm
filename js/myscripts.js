var timeout;

document.addEventListener('deviceready', function () {

    if (device.platform == "iOS") {
        initPushwoosh();
    } else {
        initPushwooshAndroid();
    }


}, false);

function initPushwoosh() {
    var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

    //set push notification callback before we initialize the plugin
    document.addEventListener('push-notification', function (event) {
        //get the notification payload
        var notification = event.notification;

        //display alert to the user for example
        //alert(notification.aps.alert);

        //clear the app badge
        pushNotification.setApplicationIconBadgeNumber(0);
    });

    //initialize the plugin
    pushNotification.onDeviceReady({pw_appid: "03DBD-4FF6F"});

    //register for pushes
    pushNotification.registerDevice(
            function (status) {
                var deviceToken = status['deviceToken'];
                window.localStorage.setItem("deviceToken", deviceToken);
                console.warn('registerDevice: ' + deviceToken);
            },
            function (status) {
                console.warn('failed to register : ' + JSON.stringify(status));
                toast(JSON.stringify(['failed to register ', status]));
            }
    );

    //reset badges on app start
    pushNotification.setApplicationIconBadgeNumber(0);

}

function initPushwooshAndroid() {
    var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");

    //set push notifications handler
    document.addEventListener('push-notification', function (event) {
        var title = event.notification.title;
        var userData = event.notification.userdata;

        if (typeof (userData) != "undefined") {
            console.warn('user data: ' + JSON.stringify(userData));
        }

    });

    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({projectid: "830986347372", pw_appid: "03DBD-4FF6F"});

    //register for pushes
    pushNotification.registerDevice(
            function (status) {
                var pushToken = status;
                console.warn('push token: ' + pushToken);
            },
            function (status) {
                console.warn(JSON.stringify(['failed to register ', status]));
            }
    );
}

function loaderShow() {
    jQuery("#preloader,#status").show();

}

function loaderHide() {
    jQuery("#preloader,#status").hide();
}

function startChat() {
    if (window.localStorage.getItem('member') == 1) {
        window.open("http://stylepanache.in/chat/personal-chat.php?name=" + window.localStorage.getItem("name") + "&email=" + window.localStorage.getItem("email") + "&dep=" + window.localStorage.getItem("department"), '_blank', 'EnableViewPortScale=yes,location=no,closebuttoncaption=Close');

    } else {
        window.open("http://stylepanache.in/chat/personal-chat.php?name=" + window.localStorage.getItem("name") + "&email=" + window.localStorage.getItem("email") + "&dep=" + window.localStorage.getItem("department"), '_blank', 'EnableViewPortScale=yes,location=no,closebuttoncaption=Close');
    }
}

function checkPLogin() {
//    window.localStorage.setItem('member', 0);
    if (window.localStorage.getItem('member') == 0) {
        var r = confirm("Are you sure you want to subscribe to StylePanache and be a Member?");
        if (r == true) {
            window.location.href = "#/questionnaire";

//            window.open("http://sp.boxcommerce.in/personal-chat.php?name=" + window.localStorage.getItem("name") + "&email=" + window.localStorage.getItem("email") + "&dep=" + window.localStorage.getItem("department"), '_blank', 'EnableViewPortScale=yes,location=no,closebuttoncaption=Close');
        }
    } else {
        window.open("http://stylepanache.in/chat/personal-chat.php?name=" + window.localStorage.getItem("name") + "&email=" + window.localStorage.getItem("email") + "&dep=" + window.localStorage.getItem("department"), '_blank', 'EnableViewPortScale=yes,location=no,closebuttoncaption=Close');
    }
}

function checkLogin() {
    if (window.localStorage.getItem('id') != null) {
        window.open("http://stylepanache.in/chat/chat.php?name=" + window.localStorage.getItem("name") + "&email=" + window.localStorage.getItem("email"), '_blank', 'EnableViewPortScale=yes,location=no,closebuttoncaption=Close');
    } else {
        jQuery("a:contains('Login')").click();
    }
}

function fbLogin() {
    
    alert("gjgjkjhk");

    var fbLoginSuccess = function (userData) {
        if (userData.authResponse) {
            loaderShow();
            facebookConnectPlugin.api('/me?fields=id,name,first_name,last_name,email', null,
                    function (response) {
                        
                       // alert(response);
                        
                         var response = jQuery.parseJSON(response);
                            if (typeof response == 'object'){


                        
                        email = response.email;
                        
                        alert(email);
                        
                        
                        first_name = response.first_name;
                         alert(first_name);
                        
                        last_name = response.last_name;
                         alert(last_name);
                        
                        image = "http://graph.facebook.com/" + response.id + "/picture?type=large";

                        jQuery.get(domain + "/check-create-user?email=" + email + '&first_name=' + first_name + "&last_name=" + last_name + "&image=" + image).success(function (data, status, headers, config) {

                            window.localStorage.setItem('id', data.id);
                            window.localStorage.setItem('name', data.first_name);
                            window.localStorage.setItem('email', data.email);
                            window.localStorage.setItem('member', data.is_member);
                            window.localStorage.setItem('prefs', JSON.stringify(data.preferences));

                            try {
                                window.localStorage.setItem('department', data.department.name);

                            }
                            catch (err) {
                                console.log(err);
                            }
                            window.localStorage.setItem('image', data.image);

                            var elem = angular.element(document.querySelector('[ng-app]'));
                            var injector = elem.injector();
                            var $rootScope = injector.get('$rootScope');

                            $rootScope.loggedIn = 1;

                            $rootScope.$apply(function () {
                                $rootScope.preferences = data.preferences;
                            });

                            $rootScope.$apply(function () {
                                $rootScope.styles = data.preferences;
                            });
                            $rootScope.$digest;
                            jQuery(".login").hide();
                            jQuery(".selectStyle").show();

                            loaderHide();

                        });
                        
                }

                    });
        }
    };



    facebookConnectPlugin.login(["public_profile", "email"], fbLoginSuccess,
            function (error) {

                toast("Error " + JSON.stringify(error))

            }

    );

}

function fbSignUp() {

    var fbLoginSuccess = function (userData) {
        if (userData.authResponse) {
            loaderShow();
            facebookConnectPlugin.api('/me?fields=id,name,first_name,last_name,email', null,
                    function (response) {
                        email = response.email;
                        first_name = response.first_name;
                        last_name = response.last_name;
                        image = "http://graph.facebook.com/" + response.id + "/picture?type=large";

                        jQuery.get(domain + "/check-create-user?email=" + email + '&first_name=' + first_name + "&last_name=" + last_name + "&image=" + image).success(function (data, status, headers, config) {
                            window.localStorage.setItem('id', data.id);
                            window.localStorage.setItem('name', data.first_name);
                            window.localStorage.setItem('email', data.email);
                            window.localStorage.setItem('member', data.is_member);
                            try {
                                window.localStorage.setItem('department', data.department.name);

                            }
                            catch (err) {
                                console.log(err);
                            }
                            window.localStorage.setItem('image', data.image);

                            var elem = angular.element(document.querySelector('[ng-app]'));
                            var injector = elem.injector();
                            var $rootScope = injector.get('$rootScope');
                            $rootScope.loggedIn = 1;

                            $rootScope.$apply(function () {
                                $rootScope.preferences = data.preferences;
                            });

                            $rootScope.$apply(function () {
                                $rootScope.styles = data.preferences;
                            });


                            $rootScope.$digest;
                            window.location.href = "#/";

                        });

                    });
        }
    };



    facebookConnectPlugin.login(["public_profile", "email"], fbLoginSuccess,
            function (error) {

                toast("Error " + JSON.stringify(error))

            }

    );

}

function shareViaWhatsapp() {


    url = "http://bit.ly/1Xo5121";


    window.plugins.socialsharing.shareViaWhatsApp('Hey, checkout this amazing App that I found. StylePanache, your Personal Guide to Styling!', null /* img */, url /* url */, function () {
        console.log('share ok')
    }, function (errormsg) {
        toast(errormsg)
    });

}

function toast(msg) {

    try {
        window.plugins.toast.show(msg, 'short', 'center', function (a) {
            console.log('toast success: ' + a)
        }, function (b) {
            alert('toast error: ' + b)
        })

    }
    catch (err) {
        alert(msg);
    }

}

function openLink(url) {
    window.open(url, '_system');
}


jQuery(document).ajaxStart(function () {

    timeout = setTimeout(function () {
        toast("Seems like the Internet Connection is too Slow! You may either continue shopping or switch to better internet.");
    }, 8000);
});

jQuery(document).ajaxSuccess(function () {
    clearTimeout(timeout);
});



$(document).ready(function () {

    if (window.localStorage.getItem('cart') === null) {
        window.localStorage.setItem('cart', JSON.stringify([]));
    }

    var elem = angular.element(document.querySelector('[ng-app]'));
    var injector = elem.injector();
    var $rootScope = injector.get('$rootScope');

    $rootScope.$on('loading:progress', function () {
        timeout = setTimeout(function () {
            toast("Seems like the Internet Connection is too Slow! You may either continue shopping or switch to better internet.");
        }, 8000);
    });

    $rootScope.$on('loading:finish', function () {
        clearTimeout(timeout);
    });

    $rootScope.share = function (e, p) {
        window.plugins.socialsharing.share(p.product, 'Hey, checkout this exciting Product that I found on StylePanache!', (p.large_image != '' ? p.large_image : (p.medium_image != '' ? p.medium_image : p.small_image)), 'http://stylepanache.in/#/' + p.url_key);
    };

    $rootScope.shareSp = function (e, p, u, i) {
        window.plugins.socialsharing.share(p, 'Hey, checkout this interesting Scrapbook that I found on StylePanache! ', i, 'http://stylepanache.in/#/' + u);
    };

    $rootScope.addToCart = function (e, p) {
        var $ = jQuery;
        e.preventDefault();
        var cart = $.parseJSON(window.localStorage.getItem("cart"));

        c = jQuery.grep(cart, function (n, i) {
            return (n.id == p.id)
        });
        if (c.length <= 0) {
            cart.push(p);
        }
        window.localStorage.setItem("cart", JSON.stringify(cart));
        toast("Product Added to Cart");
    };

    $rootScope.addToList = function (event, id) {
        if (window.localStorage.getItem('id') != null) {
            jQuery.get(domain + "/add-to-savedlist?productID=" + id + "&userId=" + window.localStorage.getItem('id')).success(function (response) {
                console.log(response);
                if (response == 1) {
                    angular.element(event.target).addClass("puffIn liked");

                } else {
                    angular.element(event.target).removeClass("puffIn liked");
                }
            });

        } else {
            window.location.href = '#/login';
        }
    };
    
$rootScope.menuFn = function(event){
        var ele = jQuery(event.target).closest('.has-submenu').children('a.deploy-submenu');
        jQuery(ele).toggleClass('active-submenu');
        jQuery(ele).parent().find('.submenu').toggleClass('active-submenu-items');
        return false;
    }

//    $rootScope.addToSList = function (event, id) {
//        if (window.localStorage.getItem('id') != null) {
//            jQuery.get(domain + "/scrapbook-like?productID=" + id + "&userId=" + window.localStorage.getItem('id')).success(function (response) {
//                console.log(response);
//                if (response == 1) {
//                    angular.element(event.target).addClass("liked");
//
//                } else {
//                    angular.element(event.target).removeClass("liked");
//                }
//console.log('sp');
//                jQuery.get(domain + "/get-scrapbook-products" + (window.localStorage.getItem('id') != null ? "?userId=" + window.localStorage.getItem('id') : "")).success(function (data, status, headers, config) {
//                    $scope.products = data;
//                    $scope.$digest;
//                });
//            });
//
//        } else {
//            window.location.href = '#/login';
//        }
//    };

    if (window.localStorage.getItem('id') != null) {

        $rootScope.$apply(function () {
            $rootScope.loggedIn = 1;
        });
    } else {
        $rootScope.$apply(function () {
            $rootScope.loggedIn = 0;
        });
    }


    $('body').on('click', '.remove-rag', function (event) {
        event.preventDefault();
        jQuery(this).parent().remove();
    });

});





