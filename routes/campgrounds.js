const express    = require("express");
const router     = express.Router();
const Campground = require("../models/campground.js");
const middleware = require("../middleware/index.js");

// INDEX
router.get("/", (req, res) => {
    Campground.find({}, (err, allCampgrounds) => {
        if (err){
            req.flash("error", "Database access error.")
            console.log(err);
        } else {
            res.render("campgrounds/index.ejs", {campgrounds:allCampgrounds});
        }
    })
});

// CREATE
router.post("/", middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const desc = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {
        name: name, 
        price: price,
        image: image, 
        description: desc,
        author: author
    };
    Campground.create(newCampground, (err, newlyCreated) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Created new campground: " + newlyCreated.name);
            res.redirect("/campgrounds/" + newlyCreated.id);
        }
    });
});

// NEW
router.get("/new", middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new.ejs");
});

// SHOW
router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundCamp) => {
        if (err || !foundCamp) {
            req.flash("error", "Campground not found.")
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/show.ejs", {campground: foundCamp});
        }
    });
});

// EDIT
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "Campground not found.")
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit.ejs", {campground: foundCampground});
        }
    });
});

// UPDATE
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp) => {
        if (err || !updatedCamp) {
            req.flash("error", "Something went wrong.")
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY
router.delete("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        if (err || !foundCampground) {
            req.flash("error", "Something went wrong.")
            res.redirect("/campgrounds");
        } else {
            foundCampground.remove((err) => {
                if (err) {
                    req.flash("error", "Something went wrong.")
                    res.redirect("/campgrounds");
                } else {
                    req.flash("success", "Campground deleted.")
                    res.redirect("/campgrounds");
                }
            });
        }
    });
});

module.exports = router;