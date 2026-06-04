const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapasync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner , validateSchema} = require("../middleware.js");
const mongoose = require("mongoose");
const listingController = require("../controllers/listings.js")
const multer =require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage})
// Validate schema middleware

// ---------------- ROUTES ----------------

// INDEX route
router.get("/", wrapAsync(listingController.index));

// NEW listing form
router.get("/new", isLoggedIn,listingController.renderNewForm );

// CREATE new listing
router.post("/", isLoggedIn, upload.single("listing[image]") ,validateSchema, wrapAsync(listingController.createNewListing));

// EDIT listing form
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListingForm));

// UPDATE listing
router.put("/:id", isLoggedIn, isOwner, validateSchema, wrapAsync(listingController.updateAfterEdit));

// SHOW listing
router.get("/:id", wrapAsync(listingController.showListing));

// DELETE listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;