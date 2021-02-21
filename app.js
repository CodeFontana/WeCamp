// REQUIRED COMPONENTS
const express               = require("express");
const app                   = express();
const bodyParser            = require("body-parser");
const mongoose              = require("mongoose");
const flash                 = require("connect-flash");
const passport              = require("passport");
const LocalStrategy         = require("passport-local");
const methodOverride        = require("method-override");
const passportLocalMongoose = require("passport-local-mongoose");
const User                  = require("./models/user");
const seedDB                = require("./seeds.js");

// REQUIRED ROUTES
const commentRoutes         = require("./routes/comments.js");
const campgroundRoutes      = require("./routes/campgrounds.js");
const indexRoutes           = require("./routes/index.js");

// DATABASE CONNECTION
mongoose.connect('mongodb://localhost:27017/wecamp', {
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.then(() => console.log('Connected to database!'))
.catch(error => console.log(error.message));

// SEED THE DATABASE
seedDB();

// EXPRESS CONFIGURATION
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Piper is the textbook definition of brown",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// CURRENT USER MIDDLEWARE
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// EXPRESS ROUTER
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);

// PAGE NOT FOUND
app.get("*", function(req, res){
    console.log("Page not found: " + req.url)
    res.send(`Page not found! [${req.url}]`);
});

// START THE SERVER
app.listen(3000, () => {
    console.log("WeCamp server is listening...");
});