"use strict";

var app = angular.module('login.controllers', ['ionic']);

app.controller('LoginCtrl', function($rootScope, $scope, $state, $ionicPopup, $translate, Service) {

    $scope.validateUser = function() {

        var username = this.user.email;
        var password = this.user.password;

        if (!username || !password) {
            $ionicPopup.alert({
                title: $translate.instant("DESIGNS"),
                template: $translate.instant("INPUTS_MISSING")
            });

            return false;
        }

        Service.showWaiting();

        Parse.User.logIn(username, password, {
            success: function(user) {

                Service.hideWaiting();

                $scope.$apply();

                $state.go('index.upload', {}, {
                    reload: true
                });

            },
            error: function(user, error) {
                console.log(user);
                console.log(error.message);
                Service.hideWaiting();

                $ionicPopup.alert({
                    title: $translate.instant("DESIGNS"),
                    template: $translate.instant("INVALID_LOGIN")
                });
            }
        });

    }

    $scope.showPopOver = function($event) {
        Service.showPopOver($event);
    }

});

app.controller('SignupCtrl', function($rootScope, $state, $scope, $ionicPopup, $translate, Service) {

    $scope.signupUser = function() {
        var username = this.user.email;
        var password = this.user.password;
        var repassword = this.user.repassword;
        var displayname = this.user.displayname;
        var telephone = this.user.telephone;

        Service.showWaiting();

        if (!username || !password) {
            Service.hideWaiting();

            $ionicPopup.alert({
                title: $translate.instant("DESIGNS"),
                template: $translate.instant("INPUTS_MISSING")
            });

            return false;
        }

        if (password != repassword) {
            Service.hideWaiting();

            $ionicPopup.alert({
                title: $translate.instant("DESIGNS"),
                template: $translate.instant("PASSWORD_MISMATCH")
            });

            return false;
        }

        var user = new Parse.User();
        user.set("username", username);
        user.set("displayname", displayname);
        user.set("password", password);
        user.set("telephone", telephone);
        user.set("email", username);

        user.signUp(null, {
            success: function(user) {

                $scope.$apply();
                $state.go('index.upload', {}, {
                    reload: true
                });

                $cordovaToast.showLongCenter($translate.instant("NEW_USER_SUCCESS"));
            },
            error: function(user, error) {
                $cordovaToast.showLongCenter($translate.instant("NEW_USER_FAIL"));
            }
        });
    }

    $scope.showPopOver = function($event) {
        Service.showPopOver($event);
    }
});

app.controller('ResetCtrl', function($scope, $ionicPopup, $translate, Service) {

    $scope.resetUser = function() {
        var email = this.user.email;

        Service.showWaiting();

        if (!email) {
            Service.hideWaiting();

            $ionicPopup.alert({
                title: $translate.instant("DESIGNS"),
                template: $translate.instant("INPUTS_MISSING")
            });

            return false;
        }

        Parse.User.requestPasswordReset(email, {
            success: function() {
                Service.hideWaiting();

                $ionicPopup.alert({
                    title: $translate.instant("DESIGNS"),
                    template: $translate.instant("PASSWORD_RESET_OK")
                });

            },
            error: function(error) {
                Service.hideWaiting();

                $ionicPopup.alert({
                    title: $translate.instant("DESIGNS"),
                    template: $translate.instant("PASSWORD_RESET_FAIL")
                });
            }
        });
    }

    $scope.showPopOver = function($event) {
        Service.showPopOver($event);
    }

});