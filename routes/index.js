const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({
  dest: 'tmp/',
  limits: {
    fileSide: 3 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.includes('image/png')) {
      cb(new Error('Mauvais format de fichier'))
    }
    cb(null, true)
  }
});
const fs = require('fs')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

router.post('/uploaddufichier', upload.array('monfichier'), (req, res) => {

  let promises = [];

  req.files.forEach(file => {

    promises.push(new Promise((resolve, reject) => {
      fs.rename(file.path, 'public/images/' + file.originalname, (err) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          resolve(file.originalname);
        }
      });
    }));

  })

  Promise
    .all(promises)
    .then(files => res.send(files.toString()))
    .catch(err => res.send(err));
})
module.exports = router;