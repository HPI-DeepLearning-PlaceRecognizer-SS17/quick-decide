'use strict';

angular.module('quickDecide')
.controller('imageDeciderController', function($scope, $rootScope, $timeout, ImageService){

    var keyActionMapping = {};

    $scope.loadedImages = [];
    $scope.currentIndex = 0;
    $scope.currentImage = {};
    $scope.hasImages = false;

    function loadImages(callback) {
        ImageService.getImagesForCurrentState().then(
            function (response){

                console.log(response.data === {});
                if(!response.data || Object.keys(response.data).length === 0){
                    $scope.loadedImages = [{
                        'selfLink': '/assets/blank.png',
                        'annotation': {
                            'id': 'There were no images found!',
                            'label': 'UNDEFINED',
                            'score': 'NONE'
                        }
                    }];
                    $scope.hasImages = false;
                } else {
                    $scope.loadedImages = $.map(response.data, function(value) {
                        return [value];
                    });
                    $scope.hasImages = true;
                }
                if(callback){
                    callback();
                }

            }
        );
    }

    function loadImageInfo(image, callback){
        ImageService.getImageInfo(image).then(
            function (response){
                image.annotation = response.data;
                $scope.currentImage = image;
                callback();
            }
        );
    }


    function displayCurrent(){
        var nextImage = $scope.loadedImages[$scope.currentIndex];

        var setImage = function(){
            $scope.currentImage = nextImage;
        };

        if(!nextImage.annotation){
            loadImageInfo(nextImage, setImage);
        } else {
            setImage();
        }
    }

    function processKeyAction(event){
        if(event.key in keyActionMapping){
           $timeout(keyActionMapping[event.key]);
        }
    }

    function init(){
        loadImages(displayCurrent);
        document.onkeyup = processKeyAction;
    }

    function reset(){
        $scope.currentIndex = 0;
        loadImages(displayCurrent);
    }

    function updateState(state, callback){
        if($scope.hasImages) {
            $scope.currentImage.annotation.annotationStatus = state;
            ImageService.updateState($scope.currentImage.annotationLink, $scope.currentImage.annotation).then(callback);
        }
    }

    function performLegalUpdate(legalStates, illegalStates, needsBoundingBox, newStatus){
        if($scope.currentImage && $scope.currentImage.annotation){
            var oldState = $scope.currentImage.annotation.annotationStatus;
            console.log(oldState, $scope.currentImage.annotation.boundingBox);
            if(legalStates.length === 0 || legalStates.indexOf(oldState) >= 0){
                console.log("yes");
                if(illegalStates.length === 0 || illegalStates.indexOf(oldState) === -1){
                    console.log("yes2");
                    if(!needsBoundingBox || $scope.currentImage.annotation.boundingBox){
                        updateState(newStatus, $scope.nextImage);
                    }
                }
            }

        }
    }

    $scope.isGood = function(){
        performLegalUpdate([],
            ['manuallyAnnotated'],
            true,
            'autoAnnotated-Good'
        );
    };

    $scope.manualAnnotationNeeded = function(){
        performLegalUpdate(['autoAnnotated', 'autoAnnotated-Good', 'none', 'ignore'],
            [], false, 'autoAnnotated-NeedsImprovement');
    };

    $scope.discard = function() {
        updateState('ignore', $scope.nextImage);
    };

    $scope.prevImage = function() {
        if($scope.currentIndex > 0){
            $scope.currentIndex--;
        }
        displayCurrent();
    };

    $scope.nextImage = function() {
        if($scope.currentIndex < $scope.loadedImages.length-1){
            $scope.currentIndex++;
        } else {
            $scope.currentIndex = $scope.loadedImages.length - 1;
        }
        $timeout(displayCurrent);
    };

    $scope.$on('events.label.updated', reset);
    $scope.$on('events.state.updated', reset);

    keyActionMapping = {
        'x': $scope.discard,
        'm': $scope.manualAnnotationNeeded,
        'g': $scope.isGood,
        'ArrowRight': $scope.nextImage,
        'ArrowLeft': $scope.prevImage
    };

    init();

});