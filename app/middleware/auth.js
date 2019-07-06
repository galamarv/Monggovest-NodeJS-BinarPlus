var jwt = require('jsonwebtoken');

const secretkey = "rahasia";

exports.isAuthenticated = (req, res, next) => {
	var token = req.body.token || req.query.token || req.headers.authorization;
	
	if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
	jwt.verify(token, secretkey, function(err, decoded) {
    if (err) {
		res.json({message : 'Failed to authenticate token'});
	}
	else {
		req.decoded = decoded;
		next();
	}
    });
}
