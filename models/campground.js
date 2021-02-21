
const mongoose = require("mongoose");
const Comment  = require("./comment.js");

let campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    author: {
       id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
       },
       username: String
    },
    comments: [
        {
           type: mongoose.Schema.Types.ObjectId,
           ref: "Comment"
        }
     ]
});

campgroundSchema.pre('remove', async function(next) {
   try {
      await Comment.deleteMany({
         _id: {
            $in: this.comments
         }
      });
      return next();
   } catch (err) {
      return next(err);
   }
});

module.exports = mongoose.model("Campground", campgroundSchema);