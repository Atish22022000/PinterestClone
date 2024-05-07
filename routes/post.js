const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Define the post schema
const PostSchema = new Schema({
    imageText: {
        type: String,
        required: true
    },
    image: {
        type:String,
       

    },
    user: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    likes: {
        type: Array,
        default: [],
    }
});

// Create and export the Post model
module.exports = mongoose.model('Post', PostSchema);
