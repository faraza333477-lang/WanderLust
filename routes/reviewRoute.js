const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapasync.js");
const{reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js")
//validate review
const validateReview= (req,res,next) =>{
 let {error} =reviewSchema.validate(req.body);
    if(error){
        let errmsg =error.details.map((el) =>el.message).join(",");
        throw new ExpressError(400,errmsg);
    } else{
        next();
    }
}

//review route 
router.post("/",isLoggedIn,validateReview ,wrapAsync(reviewController.reviewRoute));

//delete a review
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview))

module.exports = router;