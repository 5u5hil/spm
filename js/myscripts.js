var timeout;

document.addEventListener('deviceready', function () {  
    if (device.platform == "Android") { 
        jQuery('.drawer').remove();
        jQuery('.open-menu1').remove();
    }
    if (device.platform == "iOS") { 
        initPushwoosh();
    } else {
        initPushwooshAndroid();
    } 
    // window.plugins.appsFlyer.initSdk(args);
    // document.addEventListener("offline", onOffline, false);
    // var args = [];
    // var devKey = "B6KZfAcSxa9gy5gXMrDBX8";   // your AppsFlyer devKey
    // args.push(devKey);
    // var userAgent = window.navigator.userAgent.toLowerCase();

    // if (/iphone|ipad|ipod/.test( userAgent )) {
    //     var appId = "1061620079";            // your ios app id in app store
    //     args.push(appId);
    // }

function onOffline() {
    toast('Seems like you are not connected to the Internet')
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
function openInStore (app) { 

    if (device.platform  == "Android") {
      if(app == 'fb') {
        window.open('https://play.google.com/store/apps/details?id=com.facebook.katana&hl=en');
      }
      if(app == 'telegram') {
        window.open('https://play.google.com/store/apps/details?id=org.telegram.messenger&hl=en');
      }
      if(app == 'wechat') {
        window.open('https://play.google.com/store/apps/details?id=com.tencent.mm&hl=en');
      }
    }
    if (device.platform  == "iOS") {
         if(app == 'fb') {
        window.open('https://itunes.apple.com/us/app/facebook/id284882215?mt=8&ign-mpt=uo%3D2');
      }
      if(app == 'telegram') {
        window.open('https://itunes.apple.com/us/app/telegram/id747648890?mt=12&ign-mpt=uo%3D2');
      }
      if(app == 'wechat') {
 window.open('https://itunes.apple.com/us/app/wechat/id836500024?mt=12&ign-mpt=uo%3D2');
      }
    }
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

    var fbLoginSuccess = function (userData) {
        if (userData.authResponse) {
            loaderShow();
            facebookConnectPlugin.api('/me?fields=id,name,first_name,last_name,email', null,
                    function (response) {

                        if (response.email == "" || response.email == null) {
                            alert("Please provide Email permission!");
                        } else {
                            email = response.email;
                            first_name = response.first_name;
                            last_name = response.last_name;
                            image = "http://graph.facebook.com/" + response.id + "/picture?type=large";
                            jQuery.get(domain + "/check-create-user?email=" + email + '&first_name=' + first_name + "&last_name=" + last_name + "&image=" + image).success(function (data, status, headers, config) {

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

                        if (response.email == "" || response.email == null) {
                            alert("Please provide Email permission!");
                        } else {
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
                                } catch (err) {
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

function shareViaWhatsapp() {


    url = "http://bit.ly/1Xo5121";
    window.plugins.socialsharing.shareViaWhatsApp('Hey, checkout this amazing App that I found. StylePanache, your Personal Guide to Styling!', null /* img */, url /* url */, function () {
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

    } catch (err) {
        alert(msg);
    }

}

function openLink(url) {
    window.open(url, '_system');
}


// jQuery(document).ajaxStart(function () {

//     timeout = setTimeout(function () {
//         toast("Seems like the Internet Connection is too Slow! You may either continue shopping or switch to better internet.");
//     }, 15000);
// });
jQuery(document).ajaxSuccess(function () {
    clearTimeout(timeout);
});
$(document).ready(function () {

    jQuery("body").on("change", "select.orderby", function () {
        jQuery("form button").click();
    });

    if (window.localStorage.getItem('cart') === null) {
        window.localStorage.setItem('cart', JSON.stringify([]));
    }

    var elem = angular.element(document.querySelector('[ng-app]'));
    var injector = elem.injector();
    var $rootScope = injector.get('$rootScope');
    var $location = injector.get('$location');

    $rootScope.cartCnt = jQuery.parseJSON(window.localStorage.getItem('cart')).length > 0 ? jQuery.parseJSON(window.localStorage.getItem('cart')).length : "";

    $rootScope.$watch('online', function (newStatus) {
        if (newStatus === false) {
            toast('Please check your Internet Connection!');
        }
    });

    // $rootScope.$on('loading:progress', function () {
    //     timeout = setTimeout(function () {
    //         toast("Seems like the Internet Connection is too Slow! You may either continue shopping or switch to better internet.");
    //     }, 15000);
    // });
    $rootScope.$on('loading:finish', function () {
        clearTimeout(timeout);
    });
    $rootScope.share = function (e, p) {
        window.plugins.socialsharing.share('Hey, checkout this exciting Product that I found on StylePanache!', p.product, (p.large_image != '' ? p.large_image : (p.medium_image != '' ? p.medium_image : p.small_image)), 'http://stylepanache.in/#/product-detail/' + p.url_key);
    };
    $rootScope.shareSp = function (e, p, u, i) {
        window.plugins.socialsharing.share('Hey, checkout this interesting Look that I found on StylePanache! ', p, i, 'http://stylepanache.in/#/scrapbook/' + u);
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
        $rootScope.cartCnt = cart.length > 0 ? cart.length : "";

        window.localStorage.setItem("cart", JSON.stringify(cart));
        toast("Product Added to Cart");
    };
    $rootScope.addToList = function (event, id) {
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
    $rootScope.menuFn = function (event) {
        var ele = jQuery(event.target).closest('.has-submenu').children('a.deploy-submenu');
        jQuery(ele).toggleClass('active-submenu');
        jQuery(ele).parent().find('.submenu').toggleClass('active-submenu-items');
        return false;
    }
$rootScope.searchProd = function(string){
      if(!string){
        toast('Search field is required');
        return false;
      }
    var url = '/search/'+string;
    console.log(url);
    $location.path(url);
}

    $rootScope.iosBack = function (event) {

        window.history.back();
    }

    if (window.localStorage.getItem('id') != null) {

        $rootScope.$apply(function () {
            $rootScope.loggedIn = 1;
        });
    } else {
        $rootScope.$apply(function () {
            $rootScope.loggedIn = 0;
        });
    }

    if (window.localStorage.getItem('categories') != null) {
        var cats = jQuery.parseJSON(window.localStorage.getItem('categories'));
        $rootScope.$apply(function () {
            $rootScope.categories = cats;
        });
    }

    if (window.localStorage.getItem('prefs') != null) {
        var prefs = jQuery.parseJSON(window.localStorage.getItem('prefs'));
        $rootScope.$apply(function () {
            $rootScope.styles = prefs;
        });
    }


    $('body').on('click', '.remove-rag', function (event) {
        event.preventDefault();
        jQuery(this).parent().remove();
    });
});





