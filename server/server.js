'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const indexController = require('./indexcontroller.js');
const annotationController = require('./annotationcontroller.js');
const naming = require('./naming.js');

function startServer(port, publicDir, imageDir){

    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static(publicDir));

    app.get('/labels', function(req, res){
        res.send(indexController.getLabels(imageDir));
    });

    app.get('/index/recreate', function(req, res){
        console.log('Going to reload index files!');
        indexController.createIndex(imageDir);
        res.send('The index was successfully recreated. There should be no inconsistencies anymore.');
    });

    app.get('/annotation-status/:label', function(req, res){
       res.send(indexController.getAnnotationStatusCount(imageDir, req.params.label));
    });

    app.get('/:label', function(req, res){
        res.send(indexController.filterImagesByAnnotationStatus(imageDir, req.params.label, req.query.annotationStates));
    });

    app.get('/:label/:id', function(req, res){
        res.sendFile(naming.getImageFilePath(imageDir, req.params.label, req.params.id));
    });

    app.get(`/${naming.ANNOTATION_SERVER_PATH}/:label/:id`, function(req, res){
        res.sendFile(naming.getAnnotationFilePath(imageDir, req.params.label, req.params.id));
    });

    app.patch(`/${naming.ANNOTATION_SERVER_PATH}/:label/:id`, function(req, res){
        // Update image info
        annotationController.updateAnnotationStatus(imageDir, req.params.label, req.params.id, req.body.annotationStatus);
        indexController.updateImageAnnotationStatus(imageDir, req.params.label, req.params.id, req.body.annotationStatus);
        res.sendStatus(200);
    });

    app.post(`/${naming.ANNOTATION_SERVER_PATH}/:label/transformAll`, function(req, res){
        // Update image info
        if(!req.params.label || !req.query.from || !req.query.to){
            res.sendStatus(400);
        }
        indexController.updateAllAnnotationStates(imageDir, req.params.label, req.query.from, req.query.to);
        res.sendStatus(200);
    });

    app.listen(port);
    console.log('Server started on port', port, 'with image directory', imageDir);
    return app;
}





module.exports = {
    start: startServer
};