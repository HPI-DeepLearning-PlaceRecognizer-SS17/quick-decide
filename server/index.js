'use strict';

const argv = require('yargs').argv;
const path = require('path');
const server = require('./server.js');
const indexController = require('./indexcontroller.js');


function die(msg) {
    console.error(msg);
    process.exit();
}

function getAbsolutePath(relPath) {
    if (path.isAbsolute(relPath)) {
        return relPath;
    }
    return path.join(__dirname, relPath);
}

const config = {
    port: argv.port || 3010,
    dir: getAbsolutePath(argv.dir || '/images'),
    publicDir: getAbsolutePath(argv.publicDir || '../public'),
    recreateIndex: argv.recreateIndex !== null && argv.recreateIndex !== undefined
};

if (config.recreateIndex) {
    console.log('Recreating Index files...');
    indexController.createIndex(config.dir);
}


server.start(config.port, config.publicDir, config.dir);