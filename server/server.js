'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const filemanager = require('./filemanager');

function startServer(port, publicDir, imageDir){

    const app = express();

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(express.static(publicDir));

    app.get('/labels', function(req, res){
        res.send(filemanager.getLabels(imageDir));
    });

    app.get('/states/reload', function(req, res){
        console.log('Going to reload overview files!');
        filemanager.createOverviewFile(imageDir);
        res.send('The index was successfully recreated. There should be no inconsistencies anymore.');
    });

    app.get('/states/:label', function(req, res){
        res.send(filemanager.getStateCount(imageDir, req.params.label));
    });

    app.get('/:label', function(req, res){
        let states = req.query.states;
        res.send(filemanager.getFilteredImagesFor(imageDir, req.params.label, states));
    });

    app.get('/:label/:id', function(req, res){
        res.sendFile(path.join(imageDir, req.params.label, req.params.id+'.jpg'));
    });

    app.get('/info/:label/:id', function(req, res){
        res.sendFile(path.join(imageDir, req.params.label, req.params.id+'.json'));
    });

    app.patch('/info/:label/:id', function(req, res){
        // Update image info
        filemanager.updateImageStatus(imageDir, req.params.label, req.params.id, req.body.annotationStatus, true);
        res.sendStatus(200);
    });

    app.post('/info/:label/transformAll', function(req, res){
        // Update image info
        if(!req.params.label || !req.query.from || !req.query.to){
            res.sendStatus(400);
        }
        filemanager.transformAll(imageDir, req.params.label, req.query.from, req.query.to);
        res.sendStatus(200);
    });



    app.listen(port);
    console.log('Server started on port with image directory', port);
    return app;
}





module.exports = {
    start: startServer
};