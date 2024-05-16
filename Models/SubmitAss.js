const mongoose = require("mongoose");


const SubmitAssignmentSchema = new mongoose.Schema({

    Assignment: {
        type: String,
        reuired: true
    },
    WhichsubjectofAss: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assbyfac',
        required: true
    },
    submitofdate: {
        type: String,
        default: new Date()
    },
    submitedBY: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studentaddbyfac',
        required: true
    },
    PlagReportID: {
        type: String,
        reuired: true
    },
    user_id: {
        type: String,
        required: true,
    }
});

const SubmitAssbystudent = mongoose.model('SubmitAssbystudent', SubmitAssignmentSchema);
module.exports = SubmitAssbystudent; 