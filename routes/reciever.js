const express = require('express');
const recieverController = require('../controllers/recieverController');
const checkAuth = require('../middleware/check-auth'); // verify token for Api request
const router = express.Router();

// user companies routes
router.get("",checkAuth, recieverController.getSingleReciever);
router.get("/getall",checkAuth, recieverController.getAllReciever);
router.post("/addReciever",checkAuth, recieverController.addReciever);
router.put("/",checkAuth, recieverController.updateReciever);
router.delete("",checkAuth, recieverController.deleteReciever);


module.exports = router