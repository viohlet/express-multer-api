
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
    Key: `test/test.${file.ext}`
  };
  // dont actually upload yet, just pass the data down the Promise chain.
  return Promise.resolve(options); //we know that ill be using promises. telling amazon how i am uploading the file
};

const logMessage = (upload) => {
  // get rid of the stream for now, so I can log the rest of my options in the
  //terminal without seeing the stream
  delete upload.Body;
  console.log(`the upload options are ${JSON.stringify(upload)}`); // (`) starts a "template literal" (substitute the value of whatever is going through). string interpolation.
  //run the script here to see if it works. go to package.json and add ""s3-upload": "./bin/s3-upload.js". Then npm s3-upload and chmod +x... until we get error enoent
};

readFile(filename)
.then(parseFile)
.then(upload)
.then(logMessage)
.catch(console.error)
;
