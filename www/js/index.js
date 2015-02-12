angular.module('index', ['ionic', 'ngRoute', 'index.controllers', 'login'])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider

    .state('index', {
        url: "/index",
        abstract: true,
        templateUrl: "templates/index.html"
    })

    .state('index.view', {
        url: '/view',
        views: {
            'index-view': {
                templateUrl: 'templates/index-view.html',
                controller: 'ViewCtrl'
            }
        }
    })

    .state('index.upload', {
        url: '/upload',
        views: {
            'index-upload': {
                templateUrl: 'templates/index-upload.html',
                controller: 'UploadCtrl'
            }
        }
    })

    $urlRouterProvider.otherwise('/index/view');

});