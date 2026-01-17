var express = require("express");
var router = express.Router();
const multer = require('multer');
const controller = require("../controller/index");

const TYPE_IMAGE = {
  "image/png": "png"
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/file/signature/'); // Folder untuk menyimpan file
  },
  filename: function (req, file, cb) {
    const uuid = crypto.randomUUID();
    const ext = TYPE_IMAGE[file.mimetype]
    cb(null, `${uuid}.${ext}`)
  }
});
const upload = multer({ storage: storage });

router.post("/", upload.single('photo'), controller.signature.insertPhoto);
router.post("/update", upload.single('photo'), controller.signature.updatePhoto);

module.exports = router;
