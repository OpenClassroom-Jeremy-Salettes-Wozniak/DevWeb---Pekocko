// TODO: APP.JS
// Permet d'utilisé le framework express(serveur standard Node)
const express = require('express');
const app = express();

// Permet de prendre en charge le JSON
const bodyParser = require('body-parser');

// Permet de travailler avec les chemins de fichiers et de répertoires
const path = require('path');

// Permet d'utilisé mongodb
const mongoose = require('mongoose');

// Protége de certaines vulnérabilités Web connues en définissant les en-têtes HTTP de manière appropriée
// csp : Content-Security-Policy protection contre attaques cross-site scripting et autres injections
// hidePoweredBy : Supprime l’en-tête X-Powered-By qui masque le fait d'utilisé Express.
// hsts : Strict-Transport-Security qui impose des connexions (HTTP sur SSL/TLS) sécurisées au serveur.
// ieNoOpen : X-Download-Options Séfinir par défault l'enregistrement plutot que téléchargement auto.
// noCache :  Cache-Control et Pragma pour désactiver la mise en cache côté client.
// noSniff : X-Content-Type-Options pour protéger les navigateurs du reniflage du code MIME.
// frameguard : X-Frame-Options pour fournir une protection clickjacking.
// xssFilter : X-XSS-Protection afin d’activer le filtre de script intersites (XSS)
const helmet = require('helmet');

// Chemin des importation user et stuffRoutes
const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

// Variable environnement
dotenv = require('dotenv');
dotenv.config();
const USER_DB = process.env.USER_DB;
const MDP_DB = process.env.MDP_DB;
const INFO_DB = process.env.INFO_DB;

// CORS Permet à "*" tous les utilisateur de recevoir, envoyer, update, supprimer... CRUD
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization',
	);
	res.setHeader(
		'Access-Control-Allow-Methods',
		'GET, POST, PUT, DELETE, PATCH, OPTIONS',
	);
	next();
});

// Permet de connecter la base de donner avec l'application.
mongoose
	.connect('mongodb+srv://' + USER_DB + ':' + MDP_DB + INFO_DB, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('Connexion à MongoDB réussie !'))
	.catch(() => console.log('Connexion à MongoDB échouée !'));

// Protéger certaines vulnérabilités Web connues en définissant les en-têtes HTTP de manière appropriée
app.use(helmet());
// Permet de prendre en charge le JSON
app.use(bodyParser.json());

// L'pplication va utilisé URI et Function importer

app.use('/api/sauces', stuffRoutes); // Contient sauce
app.use('/api/auth', userRoutes); // Contient user
app.use('/images', express.static(path.join(__dirname, 'images'))); // Permet utilisé des images stocker

// Exporte l'application pour le server.js
module.exports = app;
