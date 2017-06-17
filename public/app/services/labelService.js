'use strict';
angular.module('quickDecide')
    .service('LabelService', function(){

        var currentLabel = 'brandenburgertor';
        var visibleStates = ['autoAnnotated'];

        return {
            getCurrentLabel: function(){
                return currentLabel;
            },
            setCurrentLabel: function(label){
                currentLabel = label;
            },
            getVisibleStates: function(){
                return visibleStates;
            },
            setVisibleStates: function(states){
                visibleStates = states;
            }
        };
    });