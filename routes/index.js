const express    = require("express");
const router     = express.Router();
const passport   = require("passport");
const User       = require("../models/user");

// ROOT
router.get("/", (req, res) => {
    res.render("landing.ejs");
});

// REGISTER GET
router.get("/register", (req, res) => {
    res.render("register.ejs");
});

// REGISTER POST
router.post("/register", (req, res) => {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            return res.render("register.ejs", {"error": err.message});
        }
        passport.authenticate("local")(req, res, () => {
            req.flash("success", "Welcome to WeCamp, " + user.username + "!")
            res.redirect("/campgrounds");
        });
    });
});

// LOGIN GET
router.get("/login", (req, res) => {
    res.render("login.ejs")
});

// LOGIN POST
router.post("/login", 
    passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), (req, res) => {

});

// LOGOUT
router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;