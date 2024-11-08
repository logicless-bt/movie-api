const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'),
	passport = require('passport');

require('./passport');

let generateJWTToken = (user) => {
	return jwt.sing(user, jwtSecret, {
		subject: user.Username,
		expiresIn: '7d',
		algorithm: 'HS256'
	});
}

//Post login
module.exports = (router) => {
	router.post('/login', (req, res) => {
		passport.authenticate('local', { session: false }, (error, user, info) => {
			if (error || !user) {
				return res.status(400).json({
					message: 'Something is wrong',
					user: user
				});
			}
			req.login(user, { session: false }, (error) => {
				if (error) {
					res.send(error);
				}
				let token = generateJWTToken(user.toJSON());
			});
		})(req, res);
	});
}