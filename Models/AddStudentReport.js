const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({


    studentattpercentage:{
        type: Number
    },
    studenttestresults:{
        type: String
    },
    studentassmarks:{
        type: String
    },
    studentdata:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Studentaddbyfac'
    },
    comments:{
        type: String,
    }, 
    severity: {
        type: String
    },
    user_id: {
        type: String,
        required: true,
    }
});

const Studentreport= mongoose.model('Studentreport', ReportSchema);
module.exports = Studentreport; 