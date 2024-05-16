const mongoose = require("mongoose");


const IndividualnotificationSchema = new mongoose.Schema({

    Individualmessage: {
        type: String,
        required: true,
    },
    attachment: {
        type: String,
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

const Individualnotificationbyadmin = mongoose.model('Individualnotificationbyadmin', IndividualnotificationSchema);
module.exports = Individualnotificationbyadmin; 