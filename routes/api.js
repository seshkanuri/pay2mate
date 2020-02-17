const express = require("express");
const router = express.Router();

const userauthRoutes = require("./userauth");
const accountRoutes = require("./useraccount");
const companyRoutes = require("./user-company");
const bankRoutes = require("./user-bank");
const checkRoutes = require("./user-check");
const recieverRoutes = require("./reciever");
const userRoutes = require("./user");
const homeRoutes = require("./home");
const cmsRoutes = require("./cms");



router.use("/auth", userauthRoutes);
router.use("/account", accountRoutes);
router.use("/reciever", recieverRoutes);
router.use("/bank", bankRoutes);
router.use("/company", companyRoutes);
router.use("/check", checkRoutes);
router.use("/user", userRoutes);
router.use("/home", homeRoutes);
router.use("/cms", cmsRoutes);


module.exports = router
