const express = require('express');
const userController = require('../controllers/userController');
const checkAuth = require('../middleware/check-auth'); // verify token for Api request
const router = express.Router();



// user companies routes
router.get("/getall", checkAuth, userController.getUsers);
router.delete("/delete", checkAuth, userController.deleteUser);
router.get("/suspend", checkAuth, userController.suspendUser);
router.get("/verify", checkAuth, userController.verifyUser);
router.get("/activate", checkAuth, userController.activateUser);
router.get("/sendEmail", checkAuth, userController.sendEmail);


module.exports = router;
