const mongoose = require("mongoose");

const recordsschema = new mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSignup', // Assuming this is your User model
        required: true
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSignup', // Assuming this is your User model
        required: true
    },
    message: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    }
});

const Conversationschema = new mongoose.Schema({

    Records:[recordsschema],

    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSignup',
        required: true
    },
    reciver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserSignup',
        required: true
    },
    user_id: {
        type: String,
        required: true,
    }

}, { timestamps: true });

const Conversationlog = mongoose.model('Conversationlog', Conversationschema);
module.exports = Conversationlog; 


// const messageSchema = new mongoose.Schema({
//     sender_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'UserSignup', // Assuming this is your User model
//         required: true
//     },
//     receiver_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'UserSignup', // Assuming this is your User model
//         required: true
//     },
//     message: {
//         type: String,
//         required: true
//     },
//     time: {
//         type: Date,
//         default: Date.now
//     }
// });

// const conversationSchema = new mongoose.Schema({
//     messages: [messageSchema], // Array of messages
//     user_id: {
//         type: String,
//         required: true
//     }
// }, { timestamps: true });

// const Conversationlog = mongoose.model('Conversationlog', conversationSchema);
// module.exports = Conversationlog;
