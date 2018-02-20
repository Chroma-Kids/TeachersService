var mongoose = require('mongoose');

var TeacherSchema = mongoose.Schema({
    name: String,
    surname: String,
    birthday: Date,
    hourstotal: {
    	type: Number
    },
    hoursweek: { 
    	type: Number, 
    	default: 40 
    },
    workshift: {
        type: String,
        enum : ['EARLY','NORMAL', 'LATE'],
        default: 'EARLY'
    },
    type: {
        type: String,
        enum : ['FIXED','FLOATING'],
        default: 'FIXED'
    },
    payload: mongoose.Schema.Types.Mixed
}, {
    timestamps: true
});

module.exports = mongoose.model('Teacher', TeacherSchema);