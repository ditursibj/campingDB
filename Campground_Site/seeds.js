var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var data = [
    {
        name: "Cloud's Rest",
        image: "https://images.pexels.com/photos/558454/pexels-photo-558454.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas luctus tellus nibh, vel laoreet eros molestie in. Pellentesque viverra purus urna, in lacinia odio pulvinar eget. Donec tincidunt urna nec augue euismod, et faucibus metus dignissim. Nullam vehicula rhoncus rutrum. Suspendisse mattis auctor dui ut pretium. Curabitur a eros eget velit hendrerit posuere. Curabitur sagittis placerat elit ut accumsan. Suspendisse molestie interdum ligula, in volutpat sem lacinia eget. Sed non urna vitae ante aliquam elementum. Etiam efficitur magna ac ante blandit imperdiet. Quisque orci nisi, volutpat ac egestas id, dignissim a urna. Nulla in venenatis eros."
    },
    {
        name: "Balls Bluff",
        image: "https://images.pexels.com/photos/1252399/pexels-photo-1252399.jpeg?auto=compress&cs=tinysrgb&h=350",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas luctus tellus nibh, vel laoreet eros molestie in. Pellentesque viverra purus urna, in lacinia odio pulvinar eget. Donec tincidunt urna nec augue euismod, et faucibus metus dignissim. Nullam vehicula rhoncus rutrum. Suspendisse mattis auctor dui ut pretium. Curabitur a eros eget velit hendrerit posuere. Curabitur sagittis placerat elit ut accumsan. Suspendisse molestie interdum ligula, in volutpat sem lacinia eget. Sed non urna vitae ante aliquam elementum. Etiam efficitur magna ac ante blandit imperdiet. Quisque orci nisi, volutpat ac egestas id, dignissim a urna. Nulla in venenatis eros."
    },
    {
        name: "Woods Retreat",
        image: "https://images.pexels.com/photos/6714/light-forest-trees-morning.jpg?auto=compress&cs=tinysrgb&h=350",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas luctus tellus nibh, vel laoreet eros molestie in. Pellentesque viverra purus urna, in lacinia odio pulvinar eget. Donec tincidunt urna nec augue euismod, et faucibus metus dignissim. Nullam vehicula rhoncus rutrum. Suspendisse mattis auctor dui ut pretium. Curabitur a eros eget velit hendrerit posuere. Curabitur sagittis placerat elit ut accumsan. Suspendisse molestie interdum ligula, in volutpat sem lacinia eget. Sed non urna vitae ante aliquam elementum. Etiam efficitur magna ac ante blandit imperdiet. Quisque orci nisi, volutpat ac egestas id, dignissim a urna. Nulla in venenatis eros."
    }
]

//Wipe everything from our DB
function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err)
        } else {
            console.log("Data has been removed");
            //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("Added a Campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function (err, comment){
                                if (err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        }   
    });
}

module.exports = seedDB;;