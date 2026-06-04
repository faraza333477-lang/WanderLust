const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const User = require("../models/users.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const userController = require("../controllers/users.js")
router.get("/signup",userController.renderSiggnUp)
//signup route
router.post("/signup",wrapAsync( userController.signUp));
//login route
router.get("/login", userController.renderlogin);
router.post("/login",saveRedirectUrl, passport.authenticate("local",{failureRedirect : '/listings/login', failureFlash: true,}),userController.loginuser);

//logut
router.get("/logout",userController.logoutUser);
module.exports=router;