var express = require("express");
var router = express.Router({mergeParams: true});
var passport = require("passport");
var Campground = require("../models/campground");
var middleware = require("../middleware/")

//INDEX - shows all campgrounds
router.get("/", function (req, res){
    //Get all campgrounds from Mongo
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            //return camprounds and the current user (if signed in)
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//Show campgrounds created by logged in user
router.get("/userCamps", middleware.isLoggedIn, function (req, res){
  Campground.find({}, function(err, allCampgrounds){
    if (err){
      console.log(err);
    } else {
      res.render("campgrounds/userCamps", {campgrounds: allCampgrounds, currentUser: req.user});
    }
  });
});

//NEW campgrounds
//Make sure user is logged in before they can add a campground
//This is done by passing isLoggedIn as a param in the .get function
router.get("/new", middleware.isLoggedIn, function(req, res) {
   //show the form
   res.render("campgrounds/new");
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    //Creat an author object that will hold the user id and username then pass it to newCampground
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, description: desc, author: author};
    //Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            //redirect to campgrounds page ( will redirect as a GET request)
            req.flash("success", "Campground successfully created!");
            res.redirect("/campgrounds");
        }
    });
});

//SHOW - shows more infro about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID and populate the comments for that campground
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    //req.body.campground will pull the name, image and description of the campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            //redirect to the campground you just edited
            res.redirect("/campgrounds/" + req.params.id)
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            req.flash("error", "Something went wrong :( ");
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground obliterated!");
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;
