var mongoose = require('mongoose');

var TeacherSchema = mongoose.Schema({
    name: String,
    surname: String,
    
}, {
    timestamps: true
});

module.exports = mongoose.model('Teacher', TeacherSchema);