var express       = require("express"),
    app           = express(),
    flash         = require("connect-flash"),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground.ejs"),
    Comment       = require("./models/comment"),
    seedDB        = require("./seeds"),
    User          = require("./models/user"),
    methodOverride= require("method-override");

var commentRoute     = require("./routes/comments"),    
    campgroundRoute  = require("./routes/campground"),
    indexRoute       = require("./routes/index");
   const { resolve } = require("path");

// mongodb://localhost:27017/yelp_camp_V11_updated
mongoose.connect("mongodb+srv://dbadmin:Allah@123@cluster0.6svez.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "/public"));
app.use(flash());
// seedDB(); 

//Passport Configuration
app.use(require("express-session")({
    secret:            "She again got the em brown eyes",
    resave:            false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error       = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});




// Campground.create(
//      {
//          name: "Granite Hill", 
//          image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg",
//          description: "This is a huge granite hill, no bathrooms.  No water. Beautiful granite!"
         
//      },
//      function(err, campground){
//       if(err){
//           console.log(err);
//       } else {
//           console.log("NEWLY CREATED CAMPGROUND: ");
//           console.log(campground);
//       }
//     });

    

app.use(indexRoute);
app.use(campgroundRoute);
app.use(commentRoute);

app.get("/", function(req, res){
    res.render("../landing");
});

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log("working server");
});