const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    regno: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phno: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    TechnicalCSE: {
        type: String,
    },
    TechnicalElectrical: {
        type: String,
    },
    Management: {
        type: String,
    },
    Design: {
        type: String,

    },
    date: {
        type: Date,
        default: Date.now
    },
    responsee : {
        type: Array,
        default: []
    },
    updatedTime: {
        type: Date,
    }
})

const User = mongoose.model('User', UserSchema);

module.exports = User;