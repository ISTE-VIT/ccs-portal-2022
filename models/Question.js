const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
            domain: {
                type: String,
                required: true
            },
            que: {
                type: String,
                required: true
            },
            optionA: {
                type: String,
                
            },
            optionB: {
                type: String,
                
            },
            optionC: {
                type: String,
                
            },
            optionD: {
                type: String
            },
            image : {
                type:String
            },
})

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;