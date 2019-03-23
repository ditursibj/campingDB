var express         = require("express"),
    request         = require("request"),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds"),
    app             = express();

//requiring ROUTES
var commentRoutes   = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes     = require("./routes/index");

//Connect mongoose to a DB
//local db mongodb://localhost/yelp_camp_v11
//Add a ENV variable MONGO_URI locally and to heroku. Locally, MONGO_URI will store the local db credentials
//MONGO_URI will store the PROD db connection in heroku
mongoose.connect(process.env.MONGO_URI)
//Always use the line below when you want to use body parser
app.use(bodyParser.urlencoded({extended: true}));
//setting view engine as ejs allows us to leave off .ejs
app.set("view engine", "ejs");
//add in public directory that houses CSS and JS
app.use(express.static(__dirname + "/public"));
//user method override
app.use(methodOverride("_method"));
//use flash
app.use(flash());

//********************************************************
//********************************************************
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I love hot dogs",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//********************************************************
//********************************************************

//Passing currentUser to the app via a middleware function
//Also passing flash messages to the entire app
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

// use process.env.PORT for deployment server
//Add the or clause with a port number for local serving
app.listen(process.env.PORT || 8000, process.env.IP, function(){
    console.log("The YelpCamp Server has Started");
});
