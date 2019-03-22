var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Check to see if user is logged in before allowing them to enter comments (isLoggedIn)
router.get("/new", middleware.isLoggedIn, function(req, res){
    //find camground by ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
               res.render("comments/new", {campground: campground}); 
        }
    });
});

//Submit form
//Add isLoggedIn to ensure rogue comments cannot be entered via POST requests (from Postman)
router.post("/", middleware.isLoggedIn, function(req,res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect campground show page
                    req.flash("success", "Comment added!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//EDIT COMMENT ROUTE
//use checkOwnership middleware to make sure user owns the comment
router.get("/:comment_id/edit", middleware.checkCommentsOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            //get campground_id to pass to the edit comment form, as well as the comment
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

//COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.rediret("back");
        } else {
            //send them back to the show page of the corresponding campground
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//COMMENTS DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentsOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            req.flash("error", "Something wen't wrong when trying to delete ths comment");
            res.redirect("back");
        } else {
            //redirect to the campground
            req.flash("success","Comment obliterated!");
            res.redirect("campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;
