var Teacher = require('../models/teacher.model.js');


exports.create = function(req, res) {
    // Create and Save a new Teacher
    if(!req.body.content) {
        res.status(400).send({message: "Teacher can not be empty"});
    }
    var teacher = new Teacher({name: req.body.name || "Unnamed Teacher", surname: req.body.surname});

    teacher.save(function(err, data) {
        if(err) {
            return res.status(500).send({message: "Some error occurred while creating the Teacher."});
        } else {
            res.send(data);
        }
    });
};

exports.findAll = function(req, res) {
    // Retrieve and return all teachers from the database.
    Teacher.find(function(err, teachers){
        if(err) {
            return res.status(500).send({message: "Some error occurred while retrieving teachers."});
        } else {
            res.send(teachers);
        }
    });
};

exports.findOne = function(req, res) {
    // Find a single teacher with a teacherId
    Teacher.findById(req.params.teacherId, function(err, data) {
        if(err) {
            return res.status(500).send({message: "Could not retrieve teacher with id " + req.params.teacherId});
        } else {
            res.send(data);
        }
    });

};

exports.update = function(req, res) {
    // Update a teacher identified by the teacherId in the request
    Teacher.findById(req.params.teacherId, function(err, teacher) {
        if(err) {
            return res.status(500).send({message: "Could not find a teacher with id " + req.params.teacherId});
        }

        teacher.name = req.body.name;
        teacher.surname = req.body.surname;

        teacher.save(function(err, data){
            if(err) {
                return res.status(500).send({message: "Could not update teacher with id " + req.params.teacherId});
            } else {
                res.send(data);
            }
        });
    });

};

exports.delete = function(req, res) {
    // Delete a teacher with the specified teacherId in the request
    Teacher.remove({_id: req.params.teacherId}, function(err, data) {
        if(err) {
            return res.status(500).send({message: "Could not delete teacher with id " + req.params.id});
        } else {
            res.send({message: "Teacher deleted successfully!"})
        }
    });
};