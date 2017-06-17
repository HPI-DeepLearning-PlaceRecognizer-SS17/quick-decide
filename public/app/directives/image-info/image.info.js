'use strict';

angular.module('quickDecide')
    .directive('imageInfo', function () {
        return {
            scope: {
                image: '='
            },
            templateUrl: 'app/directives/image-info/image-info.html'
        };
    });
