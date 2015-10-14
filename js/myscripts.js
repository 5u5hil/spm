document.addEventListener('deviceready', function () {
    initPushwoosh();


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





$(document).ready(function () {

    if (window.localStorage.getItem('cart') === null) {
        window.localStorage.setItem('cart', JSON.stringify([]));
    }

    var elem = angular.element(document.querySelector('[ng-app]'));
    var injector = elem.injector();
    var $rootScope = injector.get('$rootScope');
    
    $rootScope.share = function (e, p) {
        window.plugins.socialsharing.share(p.product, 'Hey! Checkout this cool Product from Style Panache', (p.large_image != '' ? p.large_image : (p.medium_image != '' ? p.medium_image : p.small_image)), 'http://www.x-services.nl');
    };

    $rootScope.addToCart = function (e, p) {
        var $ = jQuery;
        e.preventDefault();
        var cart = $.parseJSON(window.localStorage.getItem("cart"));
        cart.push(p);
        window.localStorage.setItem("cart", JSON.stringify(cart));
        alert("Product Added to Cart");
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

