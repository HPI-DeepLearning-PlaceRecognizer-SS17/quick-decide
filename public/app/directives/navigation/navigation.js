'use strict';

angular.module('quickDecide')
    .directive('navBar', function ($rootScope, LabelService, $http, $timeout) {
        return {
            templateUrl: 'app/directives/navigation/navigation.html',
            link: function ($scope) {
                $scope.currentLabel = angular.copy(LabelService.getCurrentLabel());
                $scope.availableLabels = [];

                $scope.updateLabel = function () {
                    LabelService.setCurrentLabel($scope.currentLabel);
                    $rootScope.$broadcast('events.label.updated', $scope.currentLabel);
                };

                $scope.autoAnnotateAsGood = function(){
                    if(window.confirm('Are you sure that you want to perfom this action?')){
                        $http.post('/annotations/'+$scope.currentLabel+'/transformAll?from=autoAnnotated&to=autoAnnotated-Good').then(
                            function(){
                                $timeout($scope.updateLabel);
                            }
                        );
                    }
                };

                $scope.recreateIndex = function(){
                    if(window.confirm('Are you sure that you want to perfom this action?')){
                        $http.get('/index/recreate').then(
                            function(){
                                $timeout($scope.updateLabel);
                            }
                        );
                    }
                };

                function init(){
                    $http.get('/labels').then(function(response){
                        console.log(response);
                        $scope.availableLabels = response.data;
                        console.log($scope.availableLabels);
                    }, console.error);
                }
                $timeout(init);
            }
        };
    });