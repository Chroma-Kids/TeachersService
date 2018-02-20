//////////////////////////////////////////////////////////////////////
// Auth - configuration of Authorization and Authentication 
// 		  teachers
////////////////////// 
var express = require('express');

var router = express.Router();
var bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

const Teacher = require('../src/models/teacher.model');

///////////////////////////////////////////////////// 
// for using JSON Web Tokens and encrypting passwords
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config/config');

router.post('/register', function(req, res) {
	// encrypt password
	var hashedPassword = bcrypt.hashSync(req.body.password, 8);  
	
	// creates teacher with the hashed password
	Teacher.create({
		name : req.body.name,
		surname : req.body.surname,
		email : req.body.email,
		password : hashedPassword
	},
	function (err, teacher) {
		if (err) 
			return res.status(500).send("There was a problem registering the teacher.")
		// create a token
		var token = jwt.sign({ 
			id: teacher._id 
		}, config.secret, {
			expiresIn: 86400 // expires in 24 hours
		});
		res.status(200).send({ 
			auth: true, 
			token: token 
		});
	}); 
})

router.get('/me', function(req, res){
	const accesToken = req.headers['x-access-token'];
	if(!accesToken)
		return res.status(401).send({auth: false, message: 'No accesToken provided.'});
	jwt.verify(accesToken, config.secret, function(err, decoded){
		if (err)
			return res.status(500).send({auth: false, message: 'Failed to authenticate accesToken.'})
		
		// be careful, this is not the method defined in controller
		// it is the one provided by mongoose
		Teacher.findById(decoded.id, 
			{ password: 0 }, // projection
			function (err, teacher) {
		  if (err) return res.status(500).send("There was a problem finding the teacher.");
		  if (!teacher) return res.status(404).send("No teacher found.");
		  
		  res.status(200).send(teacher);
		});
	})
});


router.post('/login', function(req, res) {

	Teacher.findOne({ email: req.body.email }, function (err, teacher) {
		// error checking
		if (err) 
			return res.status(500).send('Error on the server.');
		if (!teacher) 
			return res.status(404).send('No teacher found.');
		
		// compare password hashses 
		var passwordIsValid = bcrypt.compareSync(req.body.password, teacher.password);
		
		if (!passwordIsValid) 
			return res.status(401).send({ 
				auth: false, 
				token: null 
			});
		
		var token = jwt.sign({ 
			id: teacher._id 
		}, config.secret, {
	  		expiresIn: 86400 // expires in 24 hours
		});
		res.status(200).send({ 
			auth: true, 
			token: token 
		});
	});
});

router.get('/logout', function(req, res) {
	// reset token and auth 
	res.status(200).send({ 
		auth: false, 
		token: null 
	});
});

module.exports = router;
