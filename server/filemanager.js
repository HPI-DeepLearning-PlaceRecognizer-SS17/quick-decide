'use strict';

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const _ = require('lodash');


function writeJson(object, path){
    fs.writeFileSync(path, JSON.stringify(object), 'utf8');
}
function readJson(path){
    if(fs.existsSync(path)) {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    }
}

function loadInfoFile(baseDir, imageId){
    let jsonPath = path.join(baseDir, `${imageId}.json`);
    return readJson(jsonPath);
}

function loadInfoFileFromPath(imagePath){
    let imageId = filenameWithoutExt(imagePath);
    let baseDir = path.dirname(imagePath);
    return loadInfoFile(baseDir, imageId);
}



function writeInfoFile(imageInfo, baseDir, imageId){
    let jsonPath = path.join(baseDir, `${imageId}.json`);
    writeJson(imageInfo, jsonPath);
}

function filenameWithoutExt(file){
    return path.basename(file, path.extname(file));
}

function createEmptyInfo(imageId, label, state){
    return {
        'id': imageId,
        'label': label,
        'annotationStatus': state
    };
}

function createOverviewEntry(imageId, label, state){
    return {
        'id': imageId,
        'selfLink': `${label}/${imageId}`,
        'infoLink': `info/${label}/${imageId}`,
        'state': state
    };
}

function processImage(label, imagePath){
    let imageId = filenameWithoutExt(imagePath);
    let baseDir = path.dirname(imagePath);
    let imageInfo = loadInfoFile(baseDir, imageId);
    let hadChanges = false;

    if(!imageInfo){
        imageInfo = createEmptyInfo(imageId, label, 'none');
        hadChanges = true;
    }

    if(!imageInfo.annotationStatus){
        imageInfo.annotationStatus = imageInfo.boundingBox ? 'autoAnnotated' : 'none';
        hadChanges = true;
    }

    if(hadChanges){
        writeInfoFile(imageInfo, baseDir, imageId);
    }

    return createOverviewEntry(imageId, label, imageInfo.annotationStatus);
}

function createOverviewFileFor(folderInfo){
    let labelName = folderInfo[0];
    let absolutePath = folderInfo[1];
    let imageGlob = path.join(absolutePath, '*.jpg');
    let overviewPath = path.join(path.dirname(absolutePath), `${labelName}.json`);

    let imageOverview = glob.sync(imageGlob).map(imagePath => processImage(labelName, imagePath));
    imageOverview = _.keyBy(imageOverview, o => o.id);
    writeJson(imageOverview, overviewPath);
}

function getDirectories (srcpath) {
    return fs.readdirSync(srcpath)
            .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory());
}

function createOverviewFile(baseDir){
    const dirs = getDirectories(baseDir);
    dirs.map(dir => [dir, path.join(baseDir, dir)])
        .forEach(createOverviewFileFor);
}



function getLabels(baseDir){
    let overviewGlob = path.join(baseDir, '*.json');
    let overviewFiles = glob.sync(overviewGlob);
    return overviewFiles.map(filenameWithoutExt);
}

function getStateCount(baseDir, label){
    let overviewFile = path.join(baseDir, `${label}.json`);
    let overview = readJson(overviewFile);
    let groupedByStatus = _.groupBy(overview, o => o.state);
    return _.mapValues(groupedByStatus, o => o.length);
}

function getFilteredImagesFor(baseDir, label, availableStates){
    const overviewFile = path.join(baseDir, `${label}.json`);
    let overview = readJson(overviewFile);
    if(availableStates && availableStates.length > 0){
        availableStates = _.isArray(availableStates) ? availableStates : [availableStates];
        overview = Object.keys(overview)
            .filter(key => availableStates.indexOf(overview[key].state) >= 0)
            .reduce((obj, key) => {
                obj[key]= overview[key];
                return obj;
            }, {});
    }
    return overview;
}

function updateOverview(baseDir, label, imageId, newState){
    const overviewFile = path.join(baseDir, `${label}.json`);
    let overview = readJson(overviewFile);
    if(imageId in overview){
        overview[imageId].state = newState;
    } else {
        overview[imageId] = createOverviewEntry(imageId, label, newState);
    }
    writeJson(overview, overviewFile);
}

function updateImageStatus(baseDir, label, imageId, newState, doUpdateOverview){
    const labelDir = path.join(baseDir, label);
    let info = loadInfoFile(labelDir, imageId);
    if(!info){
        info = createEmptyInfo(imageId, label, newState);
    } else {
        info.annotationStatus = newState;
    }
    writeInfoFile(info, labelDir, imageId);
    if(doUpdateOverview){
        updateOverview(baseDir, label, imageId, newState);
    }
}


function transformAll(baseDir, label, from, to){
    const overviewFile = path.join(baseDir, `${label}.json`);
    let overview = readJson(overviewFile);

    for(let key in overview){
        if(overview[key].state === from){
            updateImageStatus(baseDir, label, key, to, false);
            overview[key].state = to;
        }
    }
    writeJson(overview, overviewFile);
}

module.exports = {
    createOverviewFile: createOverviewFile,
    getLabels: getLabels,
    getStateCount: getStateCount,
    getFilteredImagesFor: getFilteredImagesFor,
    updateImageStatus: updateImageStatus,
    transformAll: transformAll
};