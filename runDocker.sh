#!/bin/bash
docker run -d -v /home/place-recognizer-students/flickr-workflow/0-crawled-data:/images -p 0.0.0.0:3010:3010 quick-decidr:v1