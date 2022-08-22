// TODO: user.js de controllers
/* Import jsonwebtoken (Créez un token qui permettra à l'user de rester connecter quand il effectue
des action) */
const jwt = require('jsonwebtoken');
// Import le model user.js
const User = require('../models/User');
// Import bcrypt qui est un algorithme de cryptage
const bcrypt = require('bcrypt');

dotenv = require('dotenv');
dotenv.config();
const TOKEN_ENV = process.env.TOKEN_ENV;

// Function signup (inscription)
exports.signup = (req, res, next) => {
	/* bcrypt.hash va récuperer le mot de passe et le hasher une fois à cela on ajoute un salage (15)
	qui va hasher le hashe 15 fois */
	bcrypt
		.hash(req.body.password, 15)
		// Si il à une réponse (un mot de passe) créé un User en recupereant l'email et le hash
		.then((hash) => {
			const user = new User({
				email: req.body.email,
				password: hash,
			});
			// Sauvegarde l'user dans la DB
			user
				.save()
				.then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};

// Function login (connection)
exports.login = (req, res, next) => {
	// Va récuperer l'email écrit par user
	User.findOne({ email: req.body.email })
		// Si il y a une reponse
		.then((user) => {
			// si il y a pas de reponse retourne "Utilisateur non trouvé !"
			if (!user) {
				return res.status(401).json({ error: 'Utilisateur non trouvé !' });
			}
			// bcrypt va comparer le mot de passe saissie par user avec la reponse server
			bcrypt
				.compare(req.body.password, user.password)
				.then((valid) => {
					// Si invalide 'Mot de passe incorrect !'
					if (!valid) {
						return res.status(401).json({ error: 'Mot de passe incorrect !' });
					}
					/* Si status est 200 envoi l'user sur son espace et crée un token qui va durer 24h
					le token devra etre verifier pour voir si c'est la même personne qui effectuer
					l'action grace au middleware auth.js */
					res.status(200).json({
						userId: user._id,
						token: jwt.sign({ userId: user._id }, TOKEN_ENV, {
							expiresIn: '24h',
						}),
					});
				})
				.catch((error) => res.status(500).json({ error }));
		})
		.catch((error) => res.status(500).json({ error }));
};
