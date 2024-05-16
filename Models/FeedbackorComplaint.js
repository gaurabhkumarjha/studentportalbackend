const mongoose = require("mongoose");


const FeedbackComplaintSchema = new mongoose.Schema({

    subject: {
        type: String,
        reuired: true
    },
    description: {
        type: String,
        reuired: true
    },
    problemimage: {
        type: String,
    },
    ticketraiseofdate: {
        type: String,
        default: new Date()
    },
    createdBY: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studentaddbyfac',
        required: true
    },
    Replybyadmin: {
        type: String,
    },

    user_id: {
        type: String,
        required: true,
    }
});

const Feedback = mongoose.model('Feedback', FeedbackComplaintSchema);
module.exports = Feedback; 