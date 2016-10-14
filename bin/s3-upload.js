
'use strict';

//this has to come before anything else
require('dotenv').config(); //when we require fs module, we can say fs.readFile later. The fact we using a dot implies we have an object. Same thing here but we wont assign it to a value. This is just getting that object from an export and putting it here without a name. this is responsible for reading the env file and now node has access to read the keys.

const fs = require('fs'); //fs and no .fs because it is built in into mode
const crypto = require('crypto');

const fileType = require('file-type');
const AWS = require('aws-sdk');

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

const randomHexString = (length) => {
  return new Promise ((resolve, reject) => {
    crypto.randomBytes(length, (error, buffer) => {
      if (error) {
        reject(error);
      }

      resolve(buffer.toString('hex'));
    });
  });
};

const nameFile = (file) => {  //name directory will now resveive a promise and not a file. mutated the file inside the project
  return randomHexString(16) //return the promise and the hex
  .then((val) => {
    file.name = val;
    return file;
  });
};

const nameDirectory = (file) => {
  file.dir = new Date().toISOString().split('T')[0];
  return file;
};

// const prepareFile = (fileBuffer) => {
//   let file = mimeType(fileBuffer);
//
//   return randomHexString(16) //nw returning promise
//   .then((val) => {
//     file.name = val;
//     file.dir = new Date().toISOString().split('T')[0];
//     file.data = fileBuffer;
//   });
// };

const s3 = new AWS.S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

const upload = (file) => {
  const options = {
    // get the bucket name from your AWS S3 console
    Bucket: 'vvenegas',
    //attach the fileBuffer as a stream to send to Amazon
    Body: file.data,
    // allow anyone to access the URL of the uploaded file
    ACL: 'public-read',
    // tell Amazon (S3) what the mime-type is
    ContentType: file.mime,
    // pick a filename for S3 to use for the upload
    Key: `${file.dir}/${file.name}.${file.ext}`
  };
  // dont actually upload yet, just pass the data down the Promise chain.
  return new Promise((resolve, reject) => {
    s3.upload(options,(error, data) => {
      if (error) {
        reject(error);
      }

      resolve(data);
    });
  }); //we know that ill be using promises. telling amazon how i am uploading the file
};

const logMessage = (response) => {
  // get rid of the stream for now, so I can log the rest of my options in the
  //terminal without seeing the stream
  delete upload.Body;
  console.log(`the response from AWS was ${JSON.stringify(response)}`); // (`) starts a "template literal" (substitute the value of whatever is going through). string interpolation.
  //run the script here to see if it works. go to package.json and add ""s3-upload": "./bin/s3-upload.js". Then npm s3-upload and chmod +x... until we get error enoent
};

readFile(filename)
.then(parseFile)
.then(nameFile)
.then(nameDirectory)
.then(upload)
.then(logMessage)
.catch(console.error)
;
