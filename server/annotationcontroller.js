'use strict';

const filemanager = require('./filemanager.js');
const naming = require('./naming.js');

const ANNOTATIONSTATUS_WITHOUT_BOUNDINGBOX = 'none';
const ANNOTATIONSTATUS_WITH_BOUNDINGBOX = 'autoAnnotated';

function createNewAnnotation(imageId, label, annotationStatus) {
    return {
        'id': imageId,
        'label': label,
        'annotationStatus': annotationStatus
    };
}

function adjustAnnotationIfInvalid(annotation, imageId, label, baseDir = '', writeToFile = false){
    let madeChanges = false;

    if(!annotation){
        annotation = createNewAnnotation(imageId, label, ANNOTATIONSTATUS_WITHOUT_BOUNDINGBOX);
        madeChanges = true;
    }

    if(!annotation.annotationStatus){
        annotation.annotationStatus = annotation.boundingBox ? ANNOTATIONSTATUS_WITH_BOUNDINGBOX
            : ANNOTATIONSTATUS_WITHOUT_BOUNDINGBOX;
        madeChanges = true;
    }

    if(madeChanges && writeToFile){
        writeAnnotationFile(annotation, baseDir, label, imageId);
    }

    return annotation;
}

function readAnnotationFile(baseDir, imageId, label, writeChangesToFile){
    let filePath = naming.getAnnotationFilePath(baseDir, label, imageId);
    let annotation = filemanager.readJson(filePath);
    annotation = adjustAnnotationIfInvalid(annotation, imageId, label, baseDir, writeChangesToFile);
    return annotation;
}

function writeAnnotationFile(annotation, baseDir, label, imageId) {
    filemanager.writeJson(annotation, naming.getAnnotationFilePath(baseDir, label, imageId));
}

function updateAnnotationStatus(baseDir, label, imageId, newAnnotationStatus){
    let annotation = readAnnotationFile(baseDir, imageId, label, false);
    annotation.annotationStatus = newAnnotationStatus;
    writeAnnotationFile(annotation, baseDir, label, imageId);
}


module.exports = {
    readAnnotationFile: readAnnotationFile,
    writeAnnotationFile: writeAnnotationFile,
    updateAnnotationStatus:updateAnnotationStatus
};