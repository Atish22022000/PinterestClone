const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plm = require("passport-local-mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/myspp")

// Define the user schema
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
       
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    dp: {
        type: String // Assuming dp is a URL pointing to the user's profile picture
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String
    }
});
UserSchema.plugin(plm)

// Create and export the User model
module.exports = mongoose.model('User', UserSchema);
