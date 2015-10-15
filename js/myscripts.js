document.addEventListener('deviceready', function () {
    
    if(device.platform == "iOS"){
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
                alert(JSON.stringify(['failed to register ', status]));
            }
    );

    //reset badges on app start
    pushNotification.setApplicationIconBadgeNumber(0);

}

function  initPushwooshAndroid(){
    var pushNotification = cordova.require("com.pushwoosh.plugins.pushwoosh.PushNotification");
 
    //set push notifications handler
    document.addEventListener('push-notification', function(event) {
        var title = event.notification.title;
        var userData = event.notification.userdata;
                                 
        if(typeof(userData) != "undefined") {
            console.warn('user data: ' + JSON.stringify(userData));
        }
                                     
        alert(title);
    });
 
    //initialize Pushwoosh with projectid: "GOOGLE_PROJECT_ID", pw_appid : "PUSHWOOSH_APP_ID". This will trigger all pending push notifications on start.
    pushNotification.onDeviceReady({ projectid: "830986347372", pw_appid : "03DBD-4FF6F" });
 
    //register for pushes
    pushNotification.registerDevice(
        function(status) {
            var pushToken = status;
            console.warn('push token: ' + pushToken);
        },
        function(status) {
            console.warn(JSON.stringify(['failed to register ', status]));
        }
    );
}



$(document).ready(function () {

    if (window.localStorage.getItem('cart') === null) {
        window.localStorage.setItem('cart', JSON.stringify([]));
    }

    var elem = angular.element(document.querySelector('[ng-app]'));
    var injector = elem.injector();
    var $rootScope = injector.get('$rootScope');

    $rootScope.share = function (e, p) {
        window.plugins.socialsharing.share(p.product, 'Hey! Checkout this cool Product from Style Panache', (p.large_image != '' ? p.large_image : (p.medium_image != '' ? p.medium_image : p.small_image)), 'http://stylepanache.clu.pw/#/' + p.url_key);
    };

    $rootScope.addToCart = function (e, p) {
        var $ = jQuery;
        e.preventDefault();
        var cart = $.parseJSON(window.localStorage.getItem("cart"));
        cart.push(p);
        window.localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product Added to Cart");
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

function loaderShow() {
    jQuery("#preloader,#status").show();

}

function loaderHide() {
    jQuery("#preloader,#status").hide();
}


function checkPLogin() {
    if (window.localStorage.getItem('member') == 0) {
        var r = confirm("Are you sure you want to subscribe to SP and be a Member?");
        if (r == true) {
            window.localStorage.setItem('member', 1);
            window.open("http://sp.boxcommerce.in/personal-chat.php?name=" + window.localStorage.getItem("name") + "&email=" + window.localStorage.getItem("email") + "&dep=" + window.localStorage.getItem("department"), '_blank', 'EnableViewPortScale=yes,location=no,closebuttoncaption=Close');
        }
    } else {
        window.open("http://sp.boxcommerce.in/personal-chat.php?name=" + window.localStorage.getItem("name") + "&email=" + window.localStorage.getItem("email") + "&dep=" + window.localStorage.getItem("department"), '_blank', 'EnableViewPortScale=yes,location=no,closebuttoncaption=Close');
    }
}

function checkLogin() {
    if (window.localStorage.getItem('id') != null) {
        window.open("http://sp.boxcommerce.in/chat.php?name=" + window.localStorage.getItem("name") + "&email=" + window.localStorage.getItem("email"), '_blank', 'EnableViewPortScale=yes,location=no,closebuttoncaption=Close');
    } else {
        jQuery("a:contains('Login')").click();
    }
}




function fbLogin() {

    var fbLoginSuccess = function (userData) {
        if (userData.authResponse) {
            loaderShow();
            facebookConnectPlugin.api('/me?fields=id,name,email', null,
                    function (response) {
                        alert(JSON.stringify(response));
                        user_email = response.email;
                        user_id = response.id;
                        firstname = response.first_name;
                        lastname = response.last_name;

                        loaderHide();
                    });
        }
    };



    facebookConnectPlugin.login(["public_profile", "email"], fbLoginSuccess,
            function (error) {

                alert("Error " + JSON.stringify(error))

            }

    );

}

