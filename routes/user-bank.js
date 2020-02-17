const express = require('express');
const bankController = require('../controllers/bankController');
const checkAuth = require('../middleware/check-auth'); // verify token for Api request
const encryption = require('../middleware/cipher');
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

// user companies routes
// router.get("/getCompany",checkAuth, bankController.);
router.get("", checkAuth, bankController.getBank);
router.post("", multer({ storage: fileStorage }).any(), bankController.creatBank);
router.put("", checkAuth,
  multer({ storage: fileStorage }).single("logoImage"),
  bankController.updateBank);

router.get("/allbanks", checkAuth, bankController.getAllBanks);

router.get("/logos", checkAuth, bankController.getBankLogos);

router.post("/logos",
  multer({ storage: fileStorage }).any(),
  bankController.addBankLogos);

// bank accounts
router.get("/bank-account/getall", checkAuth, bankController.getBankAccount); // all bank account

router.get("/bank-account", checkAuth, bankController.getBankAccountById); // singlee bank account

// router.post("/bank-account",checkAuth,
//  multer({ storage: fileStorage }).single("image"),
//   bankController.creatBankAccount);

router.post("/bank-account", checkAuth,
  bankController.creatBankAccount);

router.put("/bank-account", checkAuth,
  bankController.updateBankAccount);
router.delete("/bank-account", checkAuth, bankController.deleteBankAccount);

// Add bank account sign
router.post("/bank-account/sign", checkAuth,
  multer({ storage: fileStorage }).single("signImage"),
  bankController.addSignature);

//bank account type
router.get("/bank-account/account-types", checkAuth, bankController.getBankAccountTypes); // all bank account
router.post("/bank-account/account-types", checkAuth, bankController.addBankAccountType); // all bank account
router.delete("/bank-account/account-types", checkAuth, bankController.deleteBankAccountType); // all bank account

//user signatures
router.get("/bank-account/signatures", checkAuth, bankController.getSignatures);




module.exports = router
