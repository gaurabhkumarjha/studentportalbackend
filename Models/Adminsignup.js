const mongoose = require("mongoose");


const AdminsignupSchema = new mongoose.Schema({

    adminname: {
        type: String,
        required: true,
    },
    adminphonenumber: {
        type: Number,
        required: true,
    },
    adminemail: {
        type: String,
        unique: true,
        required: true,
    },
    adminpassword: {
        type: String,
        required: true,
    },
    adminprofileimg: {
        type: String,
        required: true,
    },


    // user_id: {
    //     type: String,
    //     required: true,
    // }
});

const AdminSignup = mongoose.model('AdminSignup', AdminsignupSchema);
module.exports = AdminSignup; 