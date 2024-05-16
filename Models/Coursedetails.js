const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subjectName: String,
    credits: Number,
});

const semesterSchema = new mongoose.Schema({
    semester: String,
    subjects: [subjectSchema],
});

const CoursedetailsSchema = new mongoose.Schema({

    Studentdata: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studentaddbyfac',
        required: true

    },
    semesters: [semesterSchema],
    
    activesemester: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true,
    }
});

const Coursedetails = mongoose.model('Coursedetails', CoursedetailsSchema);
module.exports = Coursedetails; 