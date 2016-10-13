
'use strict';

const fs = require('fs'); //fs and no .fs because it is built in into mode
const fileType = require('file-type');

const filename = process.argv[2] || ''; //how we get things out of the command line. Access 3rd arg

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, (error, data) => { //readFile passes error or data not both
      if (error) {
        reject(error);
      }
      resolve(data);
    });
  });
};

//return a default object in the case that fileType is given an unsupported
//filetype to read
const mimeType = (data) => {
    return Object.assign({
      ext: 'bin',
      mime: 'application/octet-stream', //just a string of bites, binary file just got info in it
    }, fileType(data));
};

const parseFile = (fileBuffer) => {
  let file = mimeType(fileBuffer);
  file.data = fileBuffer;
  return file;
};

const logMessage = (file) => {
  console.log(`${filename} is ${file.data.length} bytes long and is of mime ${file.mime}`); // (`) starts a "template literal" (substitute the value of whatever is going through). string interpolation.
  //run the script here to see if it works. go to package.json and add ""s3-upload": "./bin/s3-upload.js". Then npm s3-upload and chmod +x... until we get error enoent
};

readFile(filename)
.then(parseFile)
.then(logMessage)
.catch(console.error)
;
