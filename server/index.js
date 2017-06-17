'use strict';

const argv = require('yargs').argv;
const path = require('path');
const server = require('./server.js');
const filemanager = require('./filemanager');


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
    // glob: argv.glob || '*.jpg',
    dir: getAbsolutePath(argv.dir || die('You need to specifiy an input directory (--dir)')),
    publicDir: getAbsolutePath(argv.publicDir || '../public'),
    reloadOverview: argv.reloadOverview !== null && argv.reloadOverview !== undefined
};

if (config.reloadOverview) {
    console.log('Reloading Overview files...');
    filemanager.createOverviewFile(config.dir);
}


server.start(config.port, config.publicDir, config.dir);