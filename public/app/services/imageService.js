'use strict';

angular.module('quickDecide')
.service('ImageService', function($http, LabelService){
    return {
        getImagesForCurrentState: function(){
            return $http.get(
                LabelService.getCurrentLabel(),
                {params: {
                    'annotationStates': LabelService.getVisibleStates()
                }}
            );
        },
        updateState: function(url, data){
            return $http.patch(url, data);
        },
        getImageInfo: function(image){
            return $http.get(image.annotationLink);
        }
    };

});