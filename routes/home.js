const express = require('express');
const homeController = require('../controllers/homeController');
const checkAuth = require('../middleware/check-auth'); // verify token for Api request
const router = express.Router();
var multer = require("multer");


// --------------multer file upload settings -------------
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

// -------------------------------------------------------


router.post(
  "/contact",
  homeController.addContactMessage
);

router.post(
  "/subscriber",
  homeController.addSubscriber
);

router.get("/contact", homeController.getContactRequests);
router.get("/contact-read", homeController.readContactRequests);
router.get("/subscribers", homeController.getSubscribers);


router.post(
  "/slider",
  multer({ storage: fileStorage }).any(),
  homeController.addSliderImages
);

router.get(
  "/slider",
  homeController.getSliderImages
);


router.delete(
  "/slider",
  homeController.deleteSliderImages
);






module.exports = router
