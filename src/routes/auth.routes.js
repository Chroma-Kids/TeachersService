module.exports = function(app) {

    var auth = require('../auth/auth.controller.js');

    // Register a Teacher
    app.post('/register', auth.register);

    // Retrieve me
    app.get('/me', auth.me);

    // // Retrieve a single Teacher with teacherId
    // app.get('/auth/:teacherId', auth.findOne);

    // // Update a Teacher with teacherId
    // app.put('/auth/:teacherId', auth.update);

    // // Delete a Teacher with teacherId
    // app.delete('/auth/:teacherId', auth.delete);
}