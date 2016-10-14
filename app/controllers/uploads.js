'use strict';

const controller = require('lib/wiring/controller');
//need multer here
const multer = require('app/middleware').multer;

const models = require('app/models');
const Upload = models.upload;

const upload = require('lib/s3-upload').upload;

// const authenticate = require('./concerns/authenticate');

const index = (req, res, next) => {
  Upload.find()
    .then(uploads => res.json({
      uploads
    }))
    .catch(err => next(err));
};

const show = (req, res, next) => {
  Upload.findById(req.params.id)
    .then(upload => upload ? res.json({
      upload
    }) : next())
    .catch(err => next(err));
};

const create = (req, res, next) => {

  upload(req.file.buffer)
  .then((response) => {
    return {
      location: response.Location,
      comment: req.body.upload.comment,
      };
    })
    .then(upload => Upload.create(upload))
    .then(upload => res.json({
      upload
    }))
    .catch(error => next(error));
};

module.exports = controller({
  index,
  show,
  create,
}, {
  before: [
    // { method: authenticate, except: ['index', 'show'] },
    {
      method: multer.single('upload[file]'),
      only: ['create']
    },
  ],
});
