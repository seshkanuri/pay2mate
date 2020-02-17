const express = require('express');
const companyController = require('../controllers/companyController');
const checkAuth = require('../middleware/check-auth'); // verify token for Api request
const router = express.Router();


// user companies routes
router.get("",checkAuth, companyController.getSingleCompany);
router.get("/getall",checkAuth, companyController.getAllCompany);
router.post("/postCompany",checkAuth, companyController.creatCompany);
router.put("/",checkAuth, companyController.updateCompany);
router.delete("",checkAuth, companyController.deleteCompany);


module.exports = router