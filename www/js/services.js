"use strict";

var module = angular.module('AppService', ['ionic', 'pascalprecht.translate', 'ngCookies']);

module.config(function($cordovaAppRateProvider, $translateProvider) {

    $translateProvider.preferredLanguage('ta-IN');
    $translateProvider.fallbackLanguage('en');
    $translateProvider.useCookieStorage();

    $translateProvider.useStaticFilesLoader({
        prefix: 'languages/',
        suffix: '.json'
    });

    document.body.classList.remove('platform-ionic');
});

module.service('Service', function($state, $rootScope, $q, $ionicLoading, $ionicPopover, $translate, $cordovaSocialSharing) {

    var logOutUser = function() {
        Parse.User.logOut();

        if (window.location.hash == '#/index/upload') {
            $state.go('index.view', {}, {
                reload: true
            });
        } else {
            $state.go('index.upload', {}, {
                reload: true
            });
        }

    }

    var share = function(message, subject, file, link) {
        document.addEventListener("deviceready", function() {
            $cordovaSocialSharing.share(message, subject, file, link);
        }, false);
    }

    var rateApp = function() {
        document.addEventListener("deviceready", function() {

            $translate(['RATE_TITLE', 'RATE_MESSAGE', 'RATE_CANCEL', 'RATE_LATER', 'RATE_NOW'])
                .then(function(translation) {
                    var customLocale = {};
                    customLocale.title = translation.RATE_TITLE;
                    customLocale.message = translation.RATE_MESSAGE;
                    customLocale.cancelButtonLabel = translation.RATE_CANCEL;
                    customLocale.laterButtonLabel = translation.RATE_LATER;
                    customLocale.rateButtonLabel = translation.RATE_NOW;
                    AppRate.preferences.openStoreInApp = true;
                    AppRate.preferences.storeAppURL.android = 'market://details?id=com.iyaffle.blouse';
                    AppRate.preferences.customLocale = customLocale;
                    AppRate.preferences.displayAppName = 'Blouse Designs';
                    AppRate.preferences.usesUntilPrompt = 5;
                    AppRate.preferences.promptAgainForEachNewVersion = false;
                    AppRate.promptForRating(true);
                });

        }, false);
    }

    var getRemoteItems = function(page, displayLimit) {
        var deferred = $q.defer()

        var query = new Parse.Query("Blouse");
        query.include("user");
        query.limit(displayLimit);
        query.skip(page * displayLimit);
        query.descending("createdAt");

        var items = [];

        query.find({
            success: function(results) {
                var s = "";
                for (var i = 0; i < results.length; i++) {

                    var pic = results[i].get("picture");
                    if (pic) {
                        var userVal = results[i].get("user");
                        var displayName = null;

                        if (userVal) {
                            displayName = userVal.get('displayname')
                        }

                        items.push({
                            url: pic.url(),
                            notes: results[i].get("notes"),
                            date: results[i].createdAt,
                            user: displayName
                        });
                    }
                }

                deferred.resolve(items);
            },
            error: function(e) {
                deferred.reject(e);
            }
        });

        return deferred.promise;
    }

    var showWaiting = function() {
        $ionicLoading.show();
    }

    var hideWaiting = function() {
        $ionicLoading.hide();
    }

    var showPopOver = function($event) {
        $rootScope.popover.show($event);
    };


    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $rootScope,
    }).then(function(popover) {
        $rootScope.popover = popover;
    });

    $rootScope.$on('$destroy', function() {
        $rootScope.popover.remove();
    });

    return {
        share: share,
        showWaiting: showWaiting,
        hideWaiting: hideWaiting,
        showPopOver: showPopOver,
        getRemoteItems: getRemoteItems,
        logOutUser: logOutUser,
        rateApp: rateApp

    }
});