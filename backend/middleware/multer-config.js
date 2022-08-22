// TODO: multer-config.js (control image)
// import multer
const multer = require('multer');

// créer un model des format autoriser
const MIME_TYPES = {
	'image/jpg': 'jpg',
	'image/jpeg': 'jpg',
	'image/png': 'png',
};

// Va permettre de télécharger
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'images');
	},
	filename: (req, file, callback) => {
		// Supprime les espace vide pour les remplacer par '_'
		const name = file.originalname.split(' ').join('_');
		// Indique les formats autoriser
		const extension = MIME_TYPES[file.mimetype];
		// nom_date.jpg
		callback(null, name + Date.now() + '.' + extension);
	},
});

// Export le module multer qui stockera les images dans le dossier 'image'
module.exports = multer({ storage: storage }).single('image');
