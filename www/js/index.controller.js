'use strict';

var app = angular.module('index.controllers', ['ionic', 'ngCordova', 'AppService']);

app.run(function($rootScope, $translate, $ionicPopup, $ionicModal, $cordovaNetwork, $cordovaToast, Service) {
    var appUrl = "https://play.google.com/store/apps/details?id=com.iyaffle.blouse&hl=en";
    $rootScope.isOnline = false;

    $rootScope.$on('$ionicView.beforeEnter', function() {
        $rootScope.currentUser = Parse.User.current() !== null;
    });

    document.addEventListener("deviceready", function() {

        var admobid = {};

        if ($cordovaNetwork.isOffline()) {
            $translate(['DEVICE_OFFLINE'])
                .then(function(translation) {
                    $cordovaToast.showLongCenter(translation.DEVICE_OFFLINE);
                });

        }

        $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
            $translate(['DEVICE_ONLINE'])
                .then(function(translation) {
                    $cordovaToast.showLongCenter(translation.DEVICE_ONLINE);
                });
        })

        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
            $translate(['DEVICE_OFFLINE'])
                .then(function(translation) {
                    $cordovaToast.showLongCenter(translation.DEVICE_OFFLINE);
                });
        })

        admobid = {
            banner: 'ca-app-pub-3787819158737121/8740002336',
            interstitial: 'ca-app-pub-3787819158737121/3813288337'
        };

        if (AdMob) AdMob.createBanner({
            adSize: 'SMART_BANNER',
            adId: admobid.banner,
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            autoShow: true,
            isTesting: false
        });

        if (AdMob) AdMob.prepareInterstitial({
            adId: admobid.interstitial,
            autoShow: true
        });

        if (AdMob) AdMob.showInterstitial();

    }, false);



    $rootScope.showPopOver = function($event) {
        Service.showPopOver($event);
    }

    $rootScope.shareNow = function() {
        $translate(['SHARE_APP_MESSAGE', 'SHARE_APP_SUBJECT'])
            .then(function(translation) {
                Service.share(translation.SHARE_APP_MESSAGE, translation.SHARE_APP_SUBJECT, null, appUrl);
            });
    }

    $rootScope.shareImageNow = function(item) {
        $translate(['SHARE_DESIGN_MESSAGE', 'SHARE_DESIGN_SUBJECT'])
            .then(function(translation) {
                Service.share(translation.SHARE_DESIGN_MESSAGE, translation.SHARE_DESIGN_SUBJECT, item.url, appUrl);
            });
    }

    $rootScope.logOutUser = function() {
        Service.logOutUser();
    }

    $rootScope.showAboutDialog = function() {
        $translate(['ABOUT_TITLE', 'ABOUT_MESSAGE', 'OK'])
            .then(function(translation) {
                var alertPopup = $ionicPopup.alert({
                    title: translation.ABOUT_TITLE,
                    template: translation.ABOUT_MESSAGE,
                    buttons: [{
                        text: translation.OK,
                        type: 'button-positive'
                    }]
                });
            });

    };

    $ionicModal.fromTemplateUrl('templates/settings.html', {
        scope: $rootScope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $rootScope.modal = modal;
    });

    $rootScope.showHelpDialog = function() {
        $translate(['HELP_TITLE', 'HELP_MESSAGE', 'OK'])
            .then(function(translation) {
                var alertPopup = $ionicPopup.alert({
                    title: translation.HELP_TITLE,
                    template: translation.HELP_MESSAGE,
                    buttons: [{
                        text: translation.OK,
                        type: 'button-positive'
                    }]
                });
            });

    };

    $translate(['TAMIL', 'ENGLISH'])
        .then(function(translation) {

            $rootScope.allLanguages = [{
                'ID': "en",
                "NAME": translation.ENGLISH
            }, {
                'ID': "ta-IN",
                "NAME": translation.TAMIL
            }];
        });

    $rootScope.dataList = {
        language: $translate.use()
    }

    $rootScope.rateApp = function() {
        Service.rateApp();
    }

    $rootScope.showSettings = function() {
        $rootScope.modal.show();
    }

    $rootScope.closeSettingsModal = function() {
        $rootScope.modal.hide();
    }

    $rootScope.$watch('dataList.language', function(newValue, oldValue) {

        if (typeof $translate.use == 'function') {
            $translate.use(newValue);
        }
    })

    $rootScope.$on('$destroy', function() {
        $rootScope.modal.remove();
    });
});

app.controller('ViewCtrl', function($rootScope, $state, $scope, $ionicSlideBoxDelegate, $ionicScrollDelegate, $translate, $timeout, $cordovaToast, Service) {

    var page = 0;
    var displayLimit = 10;
    var actualPage = 0;

    Service.showWaiting();

    $scope.dataItems = [];

    Service.getRemoteItems(page, displayLimit).then(function(results) {
            $scope.dataItems = results;

            $ionicSlideBoxDelegate.update();

            Service.hideWaiting();
        },
        function(e) {
            Service.hideWaiting();
            $cordovaToast.showLongCenter($translate.instant("REMOTE_ERROR"));
        }
    );


    $scope.slideChanged = function(index) {

        $ionicScrollDelegate.scrollTop();

        if (page == 0) {
            actualPage = 1;
        }

        if (index === $ionicSlideBoxDelegate.slidesCount() - 1) {
            Service.showWaiting();

            page = (page + 1);
            actualPage = (actualPage + 1);

            Service.getRemoteItems(page, displayLimit).then(function(results) {
                if (results.length > 0) {
                    $scope.dataItems = $scope.dataItems.concat(results);
                    $ionicSlideBoxDelegate.update();
                }
                Service.hideWaiting();
            }, function(e) {
                Service.hideWaiting();
            });
        }

        $timeout(function() {
            $ionicScrollDelegate.resize();
        }, 0);
    }

});

app.controller('UploadCtrl', function($rootScope, $state, $scope, $cordovaCamera, $translate, $ionicPopup, Service) {

    $scope.imageData = "";

    $scope.selectGallery = function() {

        document.addEventListener("deviceready", function() {

            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.PNG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(fromGallery, failHandler);

        }, false);

    }

    $scope.takeCamera = function() {

        document.addEventListener("deviceready", function() {

            var options = {
                quality: 100,
                destinationType: Camera.DestinationType.DATA_URL,
                allowEdit: true,
                encodingType: Camera.EncodingType.PNG,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options).then(fromGallery, failHandler);

        }, false);
    }

    var fromGallery = function(imagedata) {
        try {
            $scope.imageData = imagedata;

            if (imagedata !== "") {
                $scope.imageUrl = "data:image/jpeg;base64," + imagedata;
            } else {

                $cordovaToast.showLongCenter($translate.instant("INVALID_IMAGE"));

            }
        } catch (e) {
            $cordovaToast.showLongCenter(e.message);
        }
    }

    $scope.uploadImage = function() {
        Service.showWaiting();

        $scope.data = {
            comments: ""
        };

        var comments = this.data.comments;

        var BlouseObj = Parse.Object.extend("Blouse");

        var parseFile = new Parse.File("blouse.png", {
            base64: $scope.imageData
        });

        parseFile.save().then(function() {

            var blouse = new BlouseObj();
            blouse.set("notes", comments);
            blouse.set("picture", parseFile);
            blouse.set("approved", 1);
            blouse.set("user", Parse.User.current());

            blouse.save(null, {
                success: function(ob) {
                    Service.hideWaiting();

                    $state.go('index.upload', {}, {
                        reload: true
                    });

                    $cordovaToast.showLongCenter($translate.instant("UPLOAD_OK"));
                },
                error: function(e) {
                    $ionicLoading.hide();
                    $cordovaToast.showLongCenter($translate.instant("UPLOAD_FAIL"));
                }
            });

        }, function(error) {
            $ionicLoading.hide();
            $cordovaToast.showLongCenter(error.message);
        });
    }

    var failHandler = function(e) {

        $cordovaToast.showLongCenter(e.message);
    }
});