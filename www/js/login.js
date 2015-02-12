angular.module('login', ['ionic', 'ngRoute', 'login.controllers','index'])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('loginTab', {
        url: "/loginTab",
        abstract: true,
        templateUrl: "templates/loginTab.html"
    })

    .state('loginTab.login', {
        url: '/login',
        views: {
            'tab-login': {
                templateUrl: 'templates/loginTab-login.html',
                controller: 'LoginCtrl'
            }
        }
    })

    .state('loginTab.signup', {
        url: '/signup',
        views: {
            'tab-signup': {
                templateUrl: 'templates/loginTab-signup.html',
                controller: 'SignupCtrl'
            }
        }
    })

    .state('loginTab.reset', {
        url: '/reset',
        views: {
            'tab-reset': {
                templateUrl: 'templates/loginTab-reset.html',
                controller: 'ResetCtrl'
            }
        }
    })

    $urlRouterProvider.otherwise('/loginTab/login');

});