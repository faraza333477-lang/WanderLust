if(process.env.NODE_ENV != "production")
    { require('dotenv').config(); }
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = process.env.ATLASDB_URL;
const path = require("path");
const PORT = process.env.PORT || 8080;
//const { render } = require("ejs");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingr = require("./routes/listingRoutes.js");
const reviewsr = require("./routes/reviewRoute.js");
const userr = require("./routes/userRoute.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/users.js");
main().then(() => {
    console.log("Connected to DB");
})
    .catch((err) => {
        console.log(err);
    });
async function main() {
    await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/public")));

//sessions
const sessionOptions ={
    secret :"mysupersuupersecritcode",
    resave : false,
    saveUninitialized: true,
    cookie:{
        expires:Date.now() +7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly: true,
    }
};
app.use(session(sessionOptions));
app.use(flash());


//intitlizing passpord
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for flash
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser =req.user;
    next();
})


// router
app.use("/listings",userr);
app.use("/listings",listingr);
app.use("/listings/:id/reviews",reviewsr);




app.use((req,res,next)=>{
    next(new ExpressError (404,"Page Not Found!"))
})
//middleware
app.use((err, req, res, next) => {
    let{statusCode =500,message ="Something Went Wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message})
    //res.status(statusCode).send(message);
})


app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});