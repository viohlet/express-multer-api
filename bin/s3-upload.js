#!/usr/bin/env node

'use strict';

const fs = require('fs'); //fs and no .fs because it is built in into mode

const filename = process.argv[2] || ''; //how we get things out of the command line. Access 3rd arg

fs.readFile(filename, (error, data) => { //readFile passes error or data not both
  if (error) {
    return console.error(error); //return a real error later. so the file exists
  }

  console.log(`${filename} is ${data.length} bytes long`); // (`) starts a "template literal" (substitute the value of whatever is going through). string interpolation.
  //run the script here to see if it works. go to package.json and add ""s3-upload": "./bin/s3-upload.js". Then npm s3-upload and chmod +x... until we get error enoent
});
