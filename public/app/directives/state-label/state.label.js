'use strict';

angular.module('quickDecide')
    .directive('stateLabel', function () {
        return {
            scope: {
                state: '='
            },
            template: '<span class="label" ng-class="labelClass">{{state}}</span>',
            link: function ($scope) {

                $scope.labelClass = 'label-primary';

                var stateClassMapping = {
                    'autoAnnotated': 'info',
                    'autoAnnotated-Good': 'success',
                    'autoAnnotated-NeedsImprovement': 'warning',
                    'ignore': 'danger',
                    'manuallyAnnotated': 'success',
                    'none': 'warning'
                };

                var updateClass = function () {
                    $scope.labelClass = 'label-' + stateClassMapping[$scope.state];
                };

                $scope.$watch('state', updateClass);
            }
        };
    });
