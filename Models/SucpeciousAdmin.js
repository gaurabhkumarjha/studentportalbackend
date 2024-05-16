const mongoose = require("mongoose");


const SucpeciousadminSchema = new mongoose.Schema({

    adminprofileimg: {
        type: String,
        required: true,
    },

    Sucpecioustime:{
        type: String,
        default: new Date()
    }

    // user_id: {
    //     type: String,
    //     required: true,
    // }
});

const Sucpeciousadmin = mongoose.model('Sucpeciousadmin', SucpeciousadminSchema);
module.exports = Sucpeciousadmin; 