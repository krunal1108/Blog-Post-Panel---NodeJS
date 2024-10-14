const mongoose = require('mongoose');

const addSubTitleSchema = new mongoose.Schema({
    SubTitle: {
        type: String,
        required: true
    },
    topicName: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Topic model
        ref: 'Topic',  // Correct ref
        required: true
    }
});

const addSubTitle = mongoose.model('SubTitle', addSubTitleSchema);
module.exports = addSubTitle;
