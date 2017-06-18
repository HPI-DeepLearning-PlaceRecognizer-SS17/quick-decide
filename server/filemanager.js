'use strict';

const fs = require('fs');
const path = require('path');


function writeJson(object, path){
    fs.writeFileSync(path, JSON.stringify(object), 'utf8');
}

function readJson(path){
    if(fs.existsSync(path)) {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    }
}

function filenameWithoutExt(file){
    return path.basename(file, path.extname(file));
}

function getDirectories (srcpath) {
    return fs.readdirSync(srcpath)
            .filter(file => fs.lstatSync(path.join(srcpath, file)).isDirectory());
}

module.exports = {
    getDirectories: getDirectories,
    writeJson: writeJson,
    readJson: readJson,
    filenameWithoutExt: filenameWithoutExt
};