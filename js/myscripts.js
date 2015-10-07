$(document).ready(function () {
    var elem = angular.element(document.querySelector('[ng-app]'));
    var injector = elem.injector();
    var $rootScope = injector.get('$rootScope');
    if (window.localStorage.getItem('id') != null) {

        $rootScope.$apply(function () {
            $rootScope.loggedIn = 1;
        });
    }
    else {
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


function checkLogin() {
    if (window.localStorage.getItem('id') != null) {
        window.open("http://sp.boxcommerce.in/personal-chat.php?name=" + window.localStorage.getItem("name") + "&email=" + window.localStorage.getItem("name") + "&dep=Karishma", '_blank', 'EnableViewPortScale=yes,location=no,closebuttoncaption=Close');
    } else {
        jQuery("a:contains('Login')").click();
    }
}