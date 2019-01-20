var Campground = require("../models/campground");
var Comment = require("../models/campground");

//All the middleware for campgrounds and comments goes in here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    //Is user logged in?
    if (req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            //does user own the campground, if so:
            if(foundCampground.author.id.equals(req.user._id)){
                //move on to next block of code after function is called above
                next();
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
        });
    } else {
        res.flash("error", "You need to be logged in to do that!");
        res.redirect("back");        
    }
};

middlewareObj.checkCommentsOwnership = function (req, res, next) {
    //Is user logged in?
    if (req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            //does user own the comment, if so:
            //can't use === in this situation
            if(foundComment.author.id.equals(req.user._id)){
                //move on to next block of code after function is called above
                next();
            } else {
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        }
        });
    } else {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");        
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that! ");
    res.redirect("/login");
};
//export the middlewareObj that cpnotains the methods
module.exports = middlewareObj;