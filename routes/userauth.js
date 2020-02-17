const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


// user auth routes
router.post("/login", authController.logIn);
router.post("/signup", authController.signUp);


// get /email-verication?verifytoken=[string]&email=[string]&checkToken=[string(Optional)]
router.get('/email-verification', authController.emailVerification);

// reset password
router.post("/reset-request", authController.resetPasswordRequest); // send token in mail
router.get("/resetpassword/:token", authController.getresetPassword);
router.post("/resetpassword", authController.postresetPassword);

// change password

router.post("/changepassword", authController.changePassword);




module.exports = router