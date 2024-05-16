const mongoose = require("mongoose");


const AddTaskSchema = new mongoose.Schema({

    topicname: {
        type: String,
        required: true,
    },
    subtopics: {
        type: String,
        required: true,
    },
    startdate: {
        type: String,
        required: true,
    },
    enddate: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    progress:{
        type: Number,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    }
});

const AddTask = mongoose.model('AddTask', AddTaskSchema);
module.exports = AddTask; 