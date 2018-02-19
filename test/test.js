'use strict';
 
const chai = require('chai');  
const expect = require('chai').expect;
const mongoose = require('mongoose');

chai.use(require('chai-http'));
 
const app = require('../server.js'); // Our app
 
describe('API endpoint /teachers', function() {  
  this.timeout(5000); // How long to wait for a response (ms)

  before(function() {
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
    })
  });
 
  after(function() {
 
  });
 
  // GET - List all teachers
  it('should return all teachers', function() {
    return chai.request(app)
      .get('/teachers')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.results).to.be.an('array');
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
        expect(res).to.have.status(201);
        expect(res).to.be.json;
        expect(res.body).to.be.an('object');
        expect(res.body.results).to.be.an('array').that.includes(
          'Angel');
      });
  });
 
  // POST - Bad Request
  it('should return Bad Request', function() {
    return chai.request(app)
      .post('/teachers')
      .type('form')
      .send({
        name: 'Angel'
      })
      .then(function(res) {
        throw new Error('Invalid content type!');
      })
      .catch(function(err) {
        expect(err).to.have.status(400);
      });
  });
});