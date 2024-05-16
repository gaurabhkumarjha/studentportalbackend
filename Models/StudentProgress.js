const mongoose = require("mongoose");


const StudentcompletedTaskSchema = new mongoose.Schema({


    completedtask: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notesbyfac',
        required: true
    },
    studentdata: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studentaddbyfac',
        required: true
    },
    // progress: {
    //     type: Number, // Store progress as a number (percentage)
    //     default: 0,   // Default progress is 0%
    // },
    user_id: {
        type: String,
        required: true,
    }
});

const StudentTaskProgress = mongoose.model('StudentTaskProgress', StudentcompletedTaskSchema);
module.exports = StudentTaskProgress; 