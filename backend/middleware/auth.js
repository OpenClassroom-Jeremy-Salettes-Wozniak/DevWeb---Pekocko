// TODO: auth.js (control token)
const jwt = require('jsonwebtoken');

dotenv = require('dotenv');
dotenv.config();
const TOKEN_ENV = process.env.TOKEN_ENV;

module.exports = (req, res, next) => {
	// on essaye de voir si le code s'éxécute sinon renvoi sur catch
	try {
		// Recupere l'authorisation du headers
		const token = req.headers.authorization.split(' ')[1];
		// Décode le token recuperer de l'header, il faut que la clé soit la meme que dans user.js controllers
		const decodedToken = jwt.verify(token, TOKEN_ENV);
		const userId = decodedToken.userId;
		// Si body.userId et que le body.userId et different de userId
		if (req.body.userId && req.body.userId !== userId) {
			// arretera l'instruction
			throw 'Invalid user ID';
		} else {
			// sinon passe à la suite
			next();
		}
	} catch {
		res.status(401).json({
			error: new Error('Invalid request!'),
		});
	}
};
