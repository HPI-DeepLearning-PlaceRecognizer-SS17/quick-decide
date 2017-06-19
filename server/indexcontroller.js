'use strict';

const path = require('path');
const _ = require('lodash');
const glob = require('glob');
const filemanager = require('./filemanager.js');
const annotationController = require('./annotationcontroller.js');
const naming = require('./naming.js');

function readIndex(baseDir, label) {
    let indexFilePath = naming.getIndexFilePath(baseDir, label);
    return filemanager.readJson(indexFilePath);
}

function writeIndex(index, baseDir, label){
    let indexFilePath = naming.getIndexFilePath(baseDir, label);
    return filemanager.writeJson(index, indexFilePath);
}

function createIndex(baseDir){
    const directoryNames = filemanager.getDirectories(baseDir);
    directoryNames.forEach(directoryName => createIndexForLabel(baseDir, directoryName));
}

function createIndexForLabel(baseDir, label){
    let labelPath = path.join(baseDir, label);
    let imageFilePattern = path.join(labelPath, `*.${naming.IMAGE_FILEEXT}`);

    let imageIndex = glob.sync(imageFilePattern).map(imageFilePath => getIndexEntryForImage(imageFilePath, label));
    imageIndex = _.keyBy(imageIndex, entry => entry.id);
    writeIndex(imageIndex, baseDir, label);
}

function getIndexEntryForImage(imageFilePath, label){
    let imageId = filemanager.filenameWithoutExt(imageFilePath);
    let baseDir = path.dirname(path.dirname(imageFilePath));
    let imageAnnotation = annotationController.readAnnotationFile(baseDir, imageId, label);
    return createIndexEntryOfAnnotation(imageAnnotation);
}

function createIndexEntryOfAnnotation(annotation){
    return createIndexEntry(annotation.id, annotation.label, annotation.annotationStatus);
}

function createIndexEntry(imageId, label, annotationStatus){
    return {
        'id': imageId,
        'annotationStatus': annotationStatus
    };
}


function getGoodImageCount(baseDir, label){
    let statusCount = getAnnotationStatusCount(baseDir, label);
    return (statusCount['autoAnnotated-Good'] || 0) + (statusCount['manuallyAnnotated'] || 0);
}

function getLabels(baseDir){
    let indexGlob = path.join(baseDir, `*.${naming.INDEX_FILEEXT}`);
    let indexFiles = glob.sync(indexGlob);
    return indexFiles
        .map(filemanager.filenameWithoutExt)
        .reduce(function(result, item){
            console.log(item);
          result[item] = getGoodImageCount(baseDir, item);
          return result;
        },{});

}


function getAnnotationStatusCount(baseDir, label){
    let index = readIndex(baseDir, label);
    let groupedByStatus = _.groupBy(index, o => o.annotationStatus);
    return _.mapValues(groupedByStatus, o => o.length);
}


function filterImagesByAnnotationStatus(baseDir, label, availableAnnotationStates){
    let index = readIndex(baseDir, label);
    if(availableAnnotationStates && availableAnnotationStates.length > 0){
        availableAnnotationStates = _.isArray(availableAnnotationStates) ? availableAnnotationStates : [availableAnnotationStates];
        index = Object.keys(index)
            .filter(key => availableAnnotationStates.indexOf(index[key].annotationStatus) >= 0)
            .reduce((obj, key) => {
                obj[key]= index[key];
                return obj;
            }, {});
    }

    return _.mapValues(index, indexEntry => addLinks(label, indexEntry));
}

function addLinks(label, indexEntry){
    indexEntry.selfLink = `${label}/${indexEntry.id}`;
    indexEntry.annotationLink = `${naming.ANNOTATION_SERVER_PATH}/${label}/${indexEntry.id}`;
    return indexEntry;
}

function modifyIndex(baseDir, label, modificationCallback){
    let index = readIndex(baseDir, label);
    index = modificationCallback(index);
    writeIndex(index, baseDir, label);
}

function updateImageAnnotationStatus(baseDir, label, imageId, newAnnotationStatus){
    modifyIndex(baseDir, label, function(index){
        if(imageId in index){
            index[imageId].annotationStatus = newAnnotationStatus;
        } else {
            index[imageId] = createIndexEntry(imageId, label, newAnnotationStatus);
        }
        return index;
    });
}

function updateAllAnnotationStates(baseDir, label, currentAnnotationStatus, futureAnnotationStatus){
    modifyIndex(baseDir, label, function(index){
        for(let imageId in index){
            if(index[imageId].annotationStatus === currentAnnotationStatus){
                annotationController.updateAnnotationStatus(baseDir, label, imageId, futureAnnotationStatus);
                index[imageId].annotationStatus = futureAnnotationStatus;
            }
        }
        return index;
    });
}


module.exports = {
    createIndex: createIndex,
    getLabels: getLabels,
    getAnnotationStatusCount: getAnnotationStatusCount,
    filterImagesByAnnotationStatus: filterImagesByAnnotationStatus,
    updateImageAnnotationStatus: updateImageAnnotationStatus,
    updateAllAnnotationStates: updateAllAnnotationStates
};
