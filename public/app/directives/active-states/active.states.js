'use strict';

angular.module('quickDecide')
    .directive('activeStates', function ($rootScope, $http, $timeout, LabelService) {
        return {
            scope: {
                image: '='
            },
            templateUrl: 'app/directives/active-states/active-states.html',
            link: function($scope){
                $scope.possibleStates = {
                    'autoAnnotated': false,
                    'autoAnnotated-Good': false,
                    'autoAnnotated-NeedsImprovement': false,
                    'ignore': false,
                    'manuallyAnnotated': false,
                    'none': false
                };

                const defaultImageCount = {
                    'autoAnnotated': 0,
                    'autoAnnotated-Good': 0,
                    'autoAnnotated-NeedsImprovement': 0,
                    'ignore': 0,
                    'manuallyAnnotated': 0,
                    'none': 0
                };

                function getVisibleStates(){
                    var states = [];
                    for(var key in $scope.possibleStates){
                        if($scope.possibleStates[key]){
                            states.push(key);
                        }
                    }
                    console.log(states);
                    return states;
                }
                function setVisibleStates(states){
                    for(var key in $scope.possibleStates){
                        $scope.possibleStates[key] = states.indexOf(key) >= 0;
                    }
                }

                $scope.stateImageCount = angular.copy(defaultImageCount);

                $scope.reloadImageCount = function(){
                    $http.get('/states/'+LabelService.getCurrentLabel()).then(
                        function(response){
                            if(response && response.data){
                                $scope.stateImageCount = angular.extend(angular.copy(defaultImageCount), response.data);
                            }
                        }
                    );
                };

                $scope.$on('events.label.updated', $scope.reloadImageCount);

                $scope.stateChanged = function(){
                    LabelService.setVisibleStates(getVisibleStates());
                    $rootScope.$broadcast('events.state.updated', $scope.possibleStates);
                };

                function init(){
                    setVisibleStates(LabelService.getVisibleStates());
                    $scope.reloadImageCount();
                }

                $timeout(init);

            }
        };
    });
