'use strict';
 
const chai = require('chai');  
const expect = require('chai').expect;
const mongoose = require('mongoose');
const app = require('../server.js'); // Our app

chai.use(require('chai-http'));
 
///////////////////////////////////////////////////
//Should we delete the database after the test run?
const deleteAfterRun = false;
let _id = null;

let login_details = {
  'email_or_username': 'email@email.com',
  'password': '123@abc'
}
 
let register_details = {
  'fullName': 'Rexford',
  'email': 'email@email.com',
  'username': 'username',
  'password': '123@abc'
};

//////////////////////////////////////////////
// Describing API endpoint tests for /teachers
//////////////////////////////////////////////
describe('API endpoint /teachers', function() {  
  this.timeout(5000); // How long to wait for a response (ms)

  before(function(done) {
    var dbConfig = require('../config/database.config.js');
    var mongoose = require('mongoose');

    mongoose.Promise = global.Promise;

    mongoose.connect(dbConfig.url, {});

    mongoose.connection.on('error', function() {
        console.log('Could not connect to the database. Exiting now...');
        process.exit();
    });

    mongoose.connection.once('open', function() {
        console.log("Successfully connected to the database");
        done();
    });
  });
 
  after(function(done) {
    if (deleteAfterRun) {
        console.log('Deleting test database');
        mongoose.connection.db.dropDatabase(done);
    } else {
        console.log('Not deleting test database because it already existed before run');
        done();
    }
  });


 
  // POST Register, Login, Check Token
  it('it should Register, Login, and check token', function() {
    return chai.request(app)
      .post('/api/auth/login')
      .send(register_details)
      .end((err, res) => {
          res.should.have.status(201);
      });
  }); 
 
  // GET - List all teachers
  it('should return all teachers', function() {
    return chai.request(app)
      .get('/teachers')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('array');
      });
  });
 
  // GET - Invalid path
  it('should return Not Found', function() {
    return chai.request(app)
      .get('/INVALID_PATH')
      .then(function(res) {
        throw new Error('Path exists!');
      })
      .catch(function(err) {
        expect(err).to.have.status(404);
      });
  });
 
  // POST - Add new teacher
  it('should add new teacher', function() {
    return chai.request(app)
      .post('/teachers')
      .send({
        name: 'Angel',
        surname: 'Suarez'
      })
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('surname');
        expect(res.body.name).to.equal('Angel');
        expect(res.body.surname).to.equal('Suarez');
        _id = res.body._id 
      });
  }); 
  // GET - The new created teacher
  it('should return the created teacher', function() {
    return chai.request(app)
      .get('/teachers/'+_id)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('name');
        expect(res.body).to.have.property('surname');
        expect(res.body.name).to.equal('Angel');
        expect(res.body.surname).to.equal('Suarez');
      });
  });

  // DELETE - Delete a teacher
  it('should delete a teacher', function() {
    return chai.request(app)
      .delete('/teachers/'+_id)
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
      });
  });


});