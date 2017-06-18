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
    port: argv.port || 3000,
    dir: getAbsolutePath(argv.dir || die('You need to specifiy an input directory (--dir)')),
    publicDir: getAbsolutePath(argv.publicDir || '../public'),
    reloadIndex: argv.reloadIndex !== null && argv.reloadIndex !== undefined
};

if (config.reloadOverview) {
    console.log('Recreating Index files...');
    indexController.createIndex(config.dir);
}


server.start(config.port, config.publicDir, config.dir);