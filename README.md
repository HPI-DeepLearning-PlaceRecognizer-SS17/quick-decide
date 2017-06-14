# Quick Decide

Helps you quickly decide whether a bounding box is good or not.

Installation:

```
npm install
bower install
node index.js
```

On startup, there might be an error if the `--trashDir` already exists. Just ignore ot.

Possible Parameters for `node index.js`:

```
--dir       Directory of the images. REQUIRED.
--trashDir  Directory that discarded images are moved to. REQUIRED.
--glob      Pattern for the image glob (default: *.jpg)
--annoDir   Directory of the annotations (default: same as --dir). 
            CURRENTLY, THE NAMING MUST BE OF PATTERN: <IMG_NAME>.jpg matches <IMG_NAME>.json
--port      Port of the server (Default: 8080)
--keepBB    If false, Bounding Box info will be deleted on discarding (default: true)     
```

After starting, go to localhost:port (e.g. http//localhost:8080).