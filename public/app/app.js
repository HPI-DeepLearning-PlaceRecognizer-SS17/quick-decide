'use strict';

angular
    .module('quickDecide',
        ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/components/image-decider/image-decider.html',
                controller: 'imageDeciderController'
            });
    });
