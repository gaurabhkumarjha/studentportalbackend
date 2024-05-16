const mongoose = require("mongoose");


const IncorrectdetailsSchema = new mongoose.Schema({

    firstname: {
        type: String,
    },
    middlename: {
        type: String,
    },
    lastname: {
        type: String,
    },
    gender: {
        type: String,
    },
    dob: {
        type: String,
    },
    fathername: {
        type: String,
    },
    mothername: {
        type: String,
    },
    phonenumber: {
        type: String,
    },
    locality: {
        type: String,
    },
    RequstedBY: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studentaddbyfac',
        required: true
    },
    ChangedBY: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacultySignup',
        required: true
    },
    Which_Admin_are_sent_To_Faculty: {
        type: String,
    },
    Message_By_Admin: {
        type: String
    },
    status:{
        type: String,
        default: "Not Shared"
    }

});

const RequestchangedetailsbyStudent = mongoose.model('RequestchangedetailsbyStudent', IncorrectdetailsSchema);
module.exports = RequestchangedetailsbyStudent; 