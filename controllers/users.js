const User = require("../models/users.js");
module.exports.renderSiggnUp=(req,res)=>{
 res.render("users/signup.ejs");
}
module.exports.signUp=async(req,res)=>{
 try{
    let {username,email,password} = req.body;
    const newUser = new User({email,username});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser); 
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        }
         req.flash("success","User was registred Successfully");
         res.redirect("/listings");
    })
 }catch(error){
     req.flash("error",error.message);
     res.redirect("/listings/signup")
 }

}
module.exports.renderlogin=(req,res)=>{
 res.render("users/login.ejs")
}
module.exports.loginuser=async(req,res)=>{
    req.flash("success","User Login Successfully");
    let redirectUrl =res.locals.redirectUrl || "listings";
   res.redirect(redirectUrl);
}
module.exports.logoutUser=(req,res,next)=>{
    req.logout((err) =>{
        if(err){
          return next(err);
        }
        req.flash("success","Logged Out Successfully!");
        res.redirect("/listings");
    });
}