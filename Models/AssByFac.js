const mongoose = require("mongoose");


const AssignmentSchema = new mongoose.Schema({

    assbyfaculty: {
        type: String,
        required: true,
    },
    assinc:{
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true,
    }
});

const Assbyfac = mongoose.model('Assbyfac', AssignmentSchema);
module.exports = Assbyfac; 