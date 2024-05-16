const mongoose = require("mongoose");


const NotesSchema = new mongoose.Schema({

    notesbyfaculty: {
        type: String,
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    }
});

const Notesbyfac = mongoose.model('Notesbyfac', NotesSchema);
module.exports = Notesbyfac; 