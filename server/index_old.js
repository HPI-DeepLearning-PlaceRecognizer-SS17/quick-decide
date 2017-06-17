'use strict';

const argv = require('yargs').argv;
const fs = require('fs');

var path = require('path');
var glob = require('glob');


function die(msg){
    console.error(msg);
    process.exit();
}

const config = {
    port: argv.port || 8080,
    glob: argv.glob || '*.jpg',
    dir: argv.dir || die('You need to specifiy an input directory (--dir)'),
    trashDir: argv.trashDir || die('You need specify a directory for discarded images (--trashDir)'),
    keepBB: argv.keepBB || true
};

config.annotationsDir = argv.annoDir || config.dir;

function pathToFilename(file){
    return path.basename(file);
}

function getImages(glob_str){
    return new Promise(function(resolve, reject){
        glob.glob(glob_str, function(er, files){
            resolve(files.map(pathToFilename));
        });
    });
}



function getJsonFile(file) {
    return path.join(__dirname, config.annotationsDir, filenameWithoutExt(file)+'.json')
}

function getImagePath(file) {
    return path.join(__dirname, config.dir, file);
}

function getTrashPath(file) {
    return path.join(__dirname, config.trashDir, file);
}



// Getting the images & the bounding box

app.post('/discard/:file', function(req,res,next){
    fs.rename(getImagePath(req.params.file), getTrashPath(req.params.file), function(){
        if(config.keepBB){
            fs.rename(getJsonFile(req.params.file), getTrashPath(filenameWithoutExt(req.params.file)+'.json'), function(){
                console.log("Discarded", req.params.file, "but kept all files in trash dir");
                res.sendStatus(200);
            });
        } else {
            fs.unlink(getJsonFile(req.params.file), function(){
                console.log("Discarded", req.params.file, "but removed BB");
                res.sendStatus(200);
            });
        }
    });
});

app.get('/images', function(req, res, next){
    getImages(path.join(config.dir, config.glob)).then(function(images){
        res.send(images.map(function(image){
            return {
                "selfLink": "images/"+image,
                "infoLink": "info/"+image,
                "state": "autoAnnotated"
            }
        }));
        next();
    });
});

app.get('/imagecount/:label', function(req, res){
    res.send({
        'autoAnnotated': 1000,
        'autoAnnotated-Good': 10,
        'autoAnnotated-NeedsImprovement': 20,
        'ignore': 30,
        'manuallyAnnotated': 40,
        'none': 50
    });
});




app.get('/images/:file', function(req, res){
    res.sendFile(getImagePath(req.params.file));
});

app.get('/info/:file', function(req, res){
    res.sendFile(getJsonFile(req.params.file));
})

fs.mkdir(path.join(__dirname, config.trashDir), console.log);

