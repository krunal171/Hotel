// /middleware/upload.js
// const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/ids');
//   },
//   filename: function (req, file, cb) {
//     const ext = file.originalname.split('.').pop();
//     cb(null, Date.now() + '.' + ext);
//   }
// });

// const upload = multer({ storage });
// module.exports = upload;

// /middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    } catch (e) {
      return cb(e);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const allowedExt = /jpeg|jpg|png|webp|gif/;
  const allowedMime = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
  ];
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowedExt.test(ext) || allowedMime.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, webp, gif)'));
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

