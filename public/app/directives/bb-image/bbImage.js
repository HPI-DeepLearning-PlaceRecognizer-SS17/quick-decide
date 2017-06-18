'use strict';

angular.module('quickDecide')
    .directive('bbImage', function () {
        return {
            scope: {
              image: '='
            },
            templateUrl: 'app/directives/bb-image/bb-image.html',
            link: function ($scope) {
                function updateBoundingBox(){
                    if($scope.image && $scope.image.annotation && $scope.image.annotation.boundingBox){
                        $scope.boundingBox = {
                            'top': $scope.image.annotation.boundingBox.y*100+'%',
                            'left': $scope.image.annotation.boundingBox.x*100+'%',
                            'width': $scope.image.annotation.boundingBox.width*100 + '%',
                            'height': $scope.image.annotation.boundingBox.height*100 + '%',
                            'display': 'block'
                        };
                    } else {
                        $scope.boundingBox = {
                            'top': '0px',
                            'left': '0px',
                            'width': '0px',
                            'height': '0px',
                            'display': 'none'
                        };
                    }
                }

                $scope.$watch('image', updateBoundingBox);
            }
        };
    });
