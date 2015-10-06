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

function loaderShow() {
    jQuery("#preloader,#status").show();

}

function loaderHide() {
    jQuery("#preloader,#status").hide();
}

function photoFromSource(source) {
    var targetWidth = 640,
            targetHeight = 640,
            onSuccess = function (imageURI) {

                var image = new Image(),
                        canvas = document.createElement('canvas'),
                        canvasContext = canvas.getContext('2d');

                image.onload = function () {
                    canvas.width = image.width;
                    canvas.height = image.height;
                    canvasContext.drawImage(image, 0, 0, image.width, image.height);

                    var dataURL = canvas.toDataURL();

                    self.model.set('imageData', dataURL);
                    self.model.setDataAttr('image', true);
                    self.render();
                };

                image.src = imageURI;
            },
            onFail = function (message) {
                // Ignore if no image seleted
                if (!/^no image selected$/.test(message))
                    alert('Failed because: ' + message);
            },
            opts = {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: source,
                mediaType: navigator.camera.MediaType.PICTURE,
                targetWidth: targetWidth,
                targetHeight: targetHeight,
                encodingType: navigator.camera.EncodingType.JPEG,
                correctOrientation: true,
                cameraDirection: navigator.camera.Direction.BACK,
                saveToPhotoAlbum: false
            };

    try {
        navigator.camera.getPicture(onSuccess, onFail, opts);
    }
    catch (e) {
        alert('Could not capture image: ' + e);
    }
}