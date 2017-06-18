'use strict';

const path = require('path');

const INDEX_FILEEXT = 'json';
const ANNOTATION_FILEEXT = 'json';
const IMAGE_FILEEXT = 'jpg';

const ANNOTATION_SERVER_PATH = 'annotations';

function getImageFilePath(baseDir, label, imageId){
    return path.join(baseDir, label, `${imageId}.${IMAGE_FILEEXT}`);
}

function getAnnotationFilePath(baseDir, label, imageId){
    return path.join(baseDir, label, `${imageId}.${ANNOTATION_FILEEXT}`);
}

function getIndexFilePath(baseDir, label){
    return path.join(baseDir, `${label}.${INDEX_FILEEXT}`);
}

module.exports = {
    getImageFilePath: getImageFilePath,
    getAnnotationFilePath: getAnnotationFilePath,
    getIndexFilePath: getIndexFilePath,
    INDEX_FILEEXT: INDEX_FILEEXT,
    IMAGE_FILEEXT: IMAGE_FILEEXT,
    ANNOTATION_FILEEXT: ANNOTATION_FILEEXT,
    ANNOTATION_SERVER_PATH: ANNOTATION_SERVER_PATH
};