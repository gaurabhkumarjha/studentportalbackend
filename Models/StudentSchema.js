const mongoose = require("mongoose");


const StudentSchema = new mongoose.Schema({

    firstname: {
        type: String,
        required: true,
    },
    middlename: {
        type: String,
    },
    lastname: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    fathername: {
        type: String,
        required: true,
    },
    mothername: {
        type: String,
        required: true,
    },
    phonenumber: {
        type: Number,
        required: true,
    },
    locality: {
        type: String,
        required: true,
    },
    emailid: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    coursename: {
        type: String,
        required: true,
    },
    coursetype: {
        type: String,
        required: true,
    },
    sessionyear: {
        type: String,
        required: true,
    },
    rollnumber: {
        type: Number,
        required: true,
    },
    enrollementnumber: {
        type: Number,
        required: true,
    },
    courseyears: {
        type: String,
        required: true,
    },
    mentorname: {
        type: String,
        required: true,
    },
    mentorphnumber: {
        type: Number,
        required: true,
    },
    mentoremailid: {
        type: String,
        required: true,
    },
    sem1: {
        type: String,
    },
    sem2: {
        type: String,
    },
    sem3: {
        type: String,
    },
    sem4: {
        type: String,
    },
    sem5: {
        type: String,
    },
    sem6: {
        type: String,
    },
    sem7: {
        type: String,
    },
    sem8: {
        type: String,
    },
    mentordata: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FacultySignup'
    },
    studentstatus: {
        type: String,
        default: 'active'
    },
    user_id: {
        type: String,
        required: true,
    }
});

const Studentaddbyfac = mongoose.model('Studentaddbyfac', StudentSchema);
module.exports = Studentaddbyfac; 