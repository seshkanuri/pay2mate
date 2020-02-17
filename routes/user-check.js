const express = require('express');
const checkController = require('../controllers/checkController');
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



router.get(
    "/docs",
    checkAuth,
    checkController.getDocuments
);
router.post(
    "/docs",
    multer({ storage: fileStorage }).any(),
    checkController.uploadDocuments
  );


router.get("/check-number",checkAuth, checkController.checkIssuedNumber);
router.get("/check-background",checkAuth, checkController.getCheckBackgrounds);
router.delete("/check-background",checkAuth, checkController.deleteCheckBackground);
router.post(
  "/checkBacground-images",
  multer({ storage: fileStorage }).any(),
  checkController.addCheckBackground
);
// Save Check into DB
router.post("/save-check",checkAuth,
multer({ storage: fileStorage }).fields([
{name: 'backgroundImage', maxCount: 1},
{name: 'checkImage', maxCount: 1},
{name: 'secondSignImage', maxCount: 1},
]),
checkController.saveCheck);



// Save Check into DB
router.post("/save-checkBack",checkAuth,
multer({ storage: fileStorage }).fields([
{name: 'signImage', maxCount: 1},
{name: 'checkBackImage', maxCount: 1},
]),
checkController.saveCheckBack);



router.post("/sender/save-secondPartnerSign",checkAuth,
multer({ storage: fileStorage }).fields([
{name: 'signImage', maxCount: 1},
{name: 'checkImage', maxCount: 1},
]),
checkController.saveCheckSenderPartnerSign);


router.post("/reciever/save-secondPartnerSign",checkAuth,
multer({ storage: fileStorage }).fields([
{name: 'signImage', maxCount: 1},
{name: 'checkBackImage', maxCount: 1},
]),
checkController.saveCheckRecieverPartnerSign);





// Receiver Token verification
router.get("/check-recieved", checkController.checkRecievedVerification);

// senderPartner Token verification
router.get("/sign/reciever-partner", checkController.checkRecieverPartnerVerify);

//all Unread Recieve Check
router.get("/all-unread-recieve",checkAuth, checkController.UnreadRecievedCheck);

//Unread Recieve Check @param checkId
router.get("", checkController.getCheckById);


// senderPartner Token verification
router.get("/sign/sender-partner", checkController.checkSenderPartnerVerify);



//all signature request for check By Sender
router.get("/sender/all-signature-request", checkController.requestCheckSignaturesBySender);
router.get("/sender/signature-request", checkController.requestSenderCheckSignaturById);


//all signature request for check By Reciever
router.get("/reciever/all-signature-request", checkController.requestCheckSignaturesByReciever);
router.get("/reciever/signature-request", checkController.requestRecieverCheckSignaturById);


//check History
router.get("/reciever/all-checks", checkController.getAllRecievedChecks);
router.get("/sender/all-checks", checkController.getAllSentChecks);




module.exports = router
