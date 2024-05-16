const mongoose = require("mongoose");


const Usersignupschema = new mongoose.Schema({

    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    emailaddress: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    AccType: {
        type: String,
    },
    profileImg: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    }
});

const UserSignup = mongoose.model('UserSignup', Usersignupschema);
module.exports = UserSignup; 