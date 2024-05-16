const mongoose = require("mongoose");


const FacultyNotificationsSchema = new mongoose.Schema({

    notificationsforfaculty: {
        type: String,
        required: true,
    },
    dateofnotification: {
        type: String,
        default: new Date()
    },
    user_id: {
        type: String,
        required: true,
    }
});

const NotificationsforFaculty = mongoose.model('NotificationsforFaculty', FacultyNotificationsSchema);
module.exports = NotificationsforFaculty; 