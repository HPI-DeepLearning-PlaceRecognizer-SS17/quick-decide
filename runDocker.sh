#!/bin/bash
docker run -d -v /home/place-recognizer-students/flickr-workflow/0-crawled-data:/images -p 127.0.0.1:3010:3010 quick-decidr:v1