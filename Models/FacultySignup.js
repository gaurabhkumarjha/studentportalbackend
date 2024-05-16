const mongoose = require("mongoose");


const FacultysignupSchema = new mongoose.Schema({

    facultyname: {
        type: String,
        required: true,
    },
    facultyphonenumber: {
        type: Number,
        required: true,
    },
    facultysubjectname: {
        type: String,
        required: true,
    },
    facultyemail: {
        type: String,
        unique: true,
        required: true,
    },
    facultypassword: {
        type: String,
        required: true,
    },
    isfacultymentor: {
        type: String,
    },
    facultyprofileimg: {
        type: String,
        required: true,
    },


    // user_id: {
    //     type: String,
    //     required: true,
    // }
});

const FacultySignup = mongoose.model('FacultySignup', FacultysignupSchema);
module.exports = FacultySignup; 