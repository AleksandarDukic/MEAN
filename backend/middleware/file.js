const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
}

// configuring Multer
const storage = multer.diskStorage({

  /*             CONFIGURING MULTER                    */

  destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error('Invalid mime type');
        if (isValid) {
          error = null;
        }
          cb(error, "backend/images");   // first argument is a detected error - default null, second is the path where it is stored - it is relative to server.js
  },

  filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name + '-' + Date.now() + '.' + ext)
  }
});


//  multer({storage: storage}) - configuring the multer
//  multer({storage: storage}).single("image") - multer will try to extract a single file and will try to find it on the "image" property of the request body - we will provide this

module.exports =   multer({storage: storage}).single("image");
