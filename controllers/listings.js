const Listing = require("../models/listing.js");
const mongoose = require("mongoose");

module.exports.index =async (req, res) => {
  const { country } = req.query;

  let all_listings;

  if (country) {
    all_listings = await Listing.find({
      country: { $regex: country, $options: "i" }
    });
  } else {
    all_listings = await Listing.find({});
  }

  res.render("listings/index", { all_listings, country });
};

module.exports.renderNewForm=(req, res) => {
  res.render("listings/new");
};

module.exports.createNewListing=async (req, res) => {
  let url =req.file.path;
  let filename=req.file.filename;
  console.log(url,"..",filename);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image={url,filename};
  await newListing.save();
  req.flash("success", "New Listing Created Successfully!");
  res.redirect("/listings");
};

module.exports.editListingForm=async (req, res) => {
  const { id } = req.params;
   if (id && !mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Listing ID");
    return res.redirect("/listings");
}
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

module.exports.updateAfterEdit=async (req, res) => {
  const { id } = req.params;
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Listing ID");
    return res.redirect("/listings");
}
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.showListing=async (req, res) => {
  const { id } = req.params;
   if (id && !mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Listing ID");
    return res.redirect("/listings");
}
  const listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }
  res.render("listings/show", { listing });
};

module.exports.deleteListing = async (req, res) => {
  const { id } = req.params;
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    req.flash("error", "Invalid Listing ID");
    return res.redirect("/listings");
}

  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};