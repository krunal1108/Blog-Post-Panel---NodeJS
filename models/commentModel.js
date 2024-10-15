const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    blog: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Blog
        ref: 'Blog',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User
        ref: 'User',
        required: true
    }
});

const commentModel = mongoose.model('Comment', commentSchema);
module.exports = commentModel;
