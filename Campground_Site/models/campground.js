var mongoose = require("mongoose");

//Setup our Mongo schema
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    //Pull the user ID and username so we can post it when they add a campground
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            //embed a reference to the comments
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});
module.exports = mongoose.model("Campground", campgroundSchema);