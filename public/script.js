
var loadedImages = [];
var currentIndex = 0;

function loadImages(moveOne) {
    return $.get( "images", function( data ) {
        //console.log(data);
        loadedImages = data;
        if(moveOne){
            nextImage(true);
        }
    });
}

function setBoundingBoxForCurrent() {
     return $.get( "box/"+loadedImages[currentIndex], function( data ) {
        // console.log(data);
        $("#label").text(data.label);
        $("#score").text(data.score);
        $(".image-box").css('top', data.boundingBox.y+'px');
        $(".image-box").css('left', data.boundingBox.x+'px');
        $("#image-box").outerWidth(data.boundingBox.width);
        $("#image-box").outerHeight(data.boundingBox.height);
    });
}

function displayCurrent(){
    $("#image").attr('src', 'images/'+loadedImages[currentIndex]);
    setBoundingBoxForCurrent();
    updateNumbers();
}

function discard() {
    $.post("discard/"+loadedImages[currentIndex], function(success){
            loadedImages.splice(currentIndex, 1);
            if(currentIndex >= loadedImages.length){
                prevImage();
            } else {
                displayCurrent();
            }

    });
}

function prevImage() {
    if(currentIndex > 0){
        currentIndex--;
    }
    displayCurrent();
}

function nextImage(loaded) {
    if(currentIndex < loadedImages.length-1){
        currentIndex++;
    } else {
        currentIndex = loadedImages.length - 1;
        if(!loaded)
            loadImages(true);
    }
    displayCurrent();
}

function updateNumbers(){
    $("#current").text(currentIndex+1);
    $("#total").text(loadedImages.length);
}

var  doKeyAction = function(event) {
    // console.log(event.key);
    switch(event.key){
        case "ArrowRight":
            nextImage();
            break;
        case "ArrowLeft":
            prevImage();
            break;
        case "X":
        case "x":
            discard();
            break;
    }
}


$(document).ready(function () {
    loadImages().then(function(){
        displayCurrent();
    });
    document.onkeyup = doKeyAction;
});
