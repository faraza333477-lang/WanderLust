const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
module.exports.reviewRoute=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("review saved");
    req.flash("success","Review Added Successfully!!!")
    res.redirect(`/listings/${listing._id}`);
};

module.exports.deleteReview=async(req,res) =>{
  let{id,reviewId}= req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
  await Review.findByIdAndDelete(reviewId);
  console.log("review deleted");
  req.flash("success","Review Deleted Successfully!!!")
  res.redirect(`/listings/${id}`)
};