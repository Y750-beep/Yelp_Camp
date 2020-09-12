//INDEX - show all campgrounds
var express = require("express");
var router  = express.Router();
var middleware = require("../middleware");  //since our content is inside index file and index file automatically behaves as the root main file so we dont necessarily need to name it here.
var Campground = require("../models/campground.ejs");
var Comment    = require("../models/comment");

var Campground = require("../models/campground.ejs");
var Comment    = require("../models/comment");

router.get("/campgrounds", function(req, res){
    console.log(req.user);
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser: req.user});
       }
    });
});

//CREATE - add new campground to DB
router.post("/campgrounds",middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name, image: image, price:price, description: desc, author: author}
    // Create a new campground and save to DB
    
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
        req.flash("error", "You need to logIn to do that!");

   res.render("campgrounds/new.ejs"); 
});

// SHOW - shows more info about one campground
router.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

//EDIT route
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req,res){
       Campground.findById(req.params.id, function(err, foundCampground){
            res.render("campgrounds/edit", { campground: foundCampground});   
        });
            });

//update router
router.put("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, UpdatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Delete Route
router.delete("/campgrounds/:id",middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
                req.flash("Success", "Success!");

            res.redirect("/campgrounds");
        }
    });
});


//Edit Comment
router.get("/campgrounds/:id/comments/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err){
        res.redirect("back");
    }
    else{
        res.render("comments/edit", { campground_id: req.params.id, comment: foundComment});
    }
   });
});

//update comment
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }
        else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});
//delete comment
router.delete("/campgrounds/:id/comments/:comment_id",middleware.checkCommentOwnership, function(req, res){
    //find and remove 
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }
        else{
                req.flash("success", "Success!");

            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});





module.exports = router;
