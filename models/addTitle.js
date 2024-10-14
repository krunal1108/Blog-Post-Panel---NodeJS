const mongoose = require('mongoose');

const addTitleSchema = new mongoose.Schema({
    topicName: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User',
        required: true
    }
});

const addTitle = mongoose.model('Topic', addTitleSchema);
module.exports = addTitle;
