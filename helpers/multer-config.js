
var multer = require("multer");

exports.fileUpload = (req,res, next) => {

    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, "./uploads");
        },
      
        filename: (req, file, cb) => {
          cb(null, Date.now() + "-" + file.originalname);
        }
      });

      next();

}