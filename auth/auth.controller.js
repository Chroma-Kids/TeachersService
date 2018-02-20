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
		password : hashedPassword
	},
	function (err, user) {
		if (err) 
			return res.status(500).send("There was a problem registering the user.")
		// create a token
		var token = jwt.sign({ 
			id: user._id 
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
		
		res.status(200).send(decoded);
	})
});

module.exports = router;
