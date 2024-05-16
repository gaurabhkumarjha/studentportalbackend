const mongoose = require("mongoose");


const ReplyIndividualnotificationSchema = new mongoose.Schema({

    Replymessage: {
        type: String,
        required: true,
    },
    attachment: {
        type: String,
    },
    Which_message_Reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Individualnotificationbyadmin',
        required: true,
    },
    Faculty_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacultySignup',
        required: true,
    },
    Admin_id: {
        type: String,
        required: true,
    }
});

const ReplyIndividualnotificationforadmin = mongoose.model('ReplyIndividualnotificationforadmin', ReplyIndividualnotificationSchema);
module.exports = ReplyIndividualnotificationforadmin; 