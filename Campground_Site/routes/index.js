var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//LANDING PAGE
router.get("/", function(req, res){
    res.render("landing");
});

//********************************************************
//AUTHORIZATION ROUTES
//show register form
router.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
router.post("/register", function(req, res){
    //create a variable to store the logic for creting a new username
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function (err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        //if sign up successful, redirect to campgrounds page
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Thanks for Registering " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

//show login form
router.get("/login", function(req, res){
    res.render("login");
});

//Handle the login logic
//use middleware via passport to authenticate new user, using the LocalStrategy created above
router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

//logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("error", "Logged you out!");
    res.redirect("/campgrounds");
});


module.exports = router;