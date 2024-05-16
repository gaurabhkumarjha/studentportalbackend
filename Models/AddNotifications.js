const mongoose = require("mongoose");


const NotificationsSchema = new mongoose.Schema({

    notificationsbyfac: {
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

const Notificationsbyfac = mongoose.model('Notificationsbyfac', NotificationsSchema);
module.exports = Notificationsbyfac; 