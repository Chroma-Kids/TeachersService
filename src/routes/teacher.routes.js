module.exports = function(app) {

    var teachers = require('../controllers/teacher.controller.js');

    // Create a new Teacher
    app.post('/teachers', teachers.create);

    // Retrieve all Teachers
    app.get('/teachers', teachers.findAll);

    // Retrieve a single Teacher with teacherId
    app.get('/teachers/:teacherId', teachers.findOne);

    // Update a Teacher with teacherId
    app.put('/teachers/:teacherId', teachers.update);

    // Delete a Teacher with teacherId
    app.delete('/teachers/:teacherId', teachers.delete);
}