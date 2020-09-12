// ****************************************
//Comment Routes
var express = require("express");
var router  = express.Router();
var middleware = require("../middleware"); 

var Campground = require("../models/campground.ejs");
var Comment    = require("../models/comment");

router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground: campground});
        }
    })
});

router.post("/campgrounds/:id/comments", middleware.isLoggedIn,  function(req, res){
    //lookup campground id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }
                else{
                    //ad username
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                   

                    //save comment
                    comment.save();
                    campground.comments.push(comment);
            campground.save();
            req.flash("success", "Successfully Added A New Comment");
            res.redirect("/campgrounds/"+ campground._id);
                }
            });
            
        }
    });
});


module.exports = router;
