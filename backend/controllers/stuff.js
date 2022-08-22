// TODO: stuff.js de controllers

// Import le model Thing (qui sont les sauces)
const Thing = require('../models/Things');
// import fs qui sert naviger dans les fichiers
const fs = require('fs');

exports.createThing = (req, res, next) => {
	// Function qui permet de créer une sauce
	// Convertir la response JSON en valeur javascript
	const sauceObject = JSON.parse(req.body.sauce);
	// Construit une sauce
	const sauce = new Thing({
		userId: sauceObject.userId,
		name: sauceObject.name,
		manufacturer: sauceObject.manufacturer,
		description: sauceObject.description,
		//Expression dynamique pour recréer l'adresse url pour trouver le fichier téléchargé récupéré par multer
		imageUrl: `${req.protocol}://${req.get('host')}/images/${
			req.file.filename
		}`,
		mainPepper: sauceObject.mainPepper,
		heat: sauceObject.heat,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: [],
	});
	sauce
		.save() // La methode save renvoie une Promise donc :
		.then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
		.catch((error) => res.status(400).json({ error })); // ou une erreur code 400
};

exports.getOneThing = (req, res, next) => {
	// Function permettant l'affichage d'une sauce
	// Récupération de la reponse l'id d'une Thing (un sauce)
	Thing.findOne({
		_id: req.params.id,
	})
		.then((thing) => {
			// si reponse retourne thing
			res.status(200).json(thing);
		})
		.catch((error) => {
			res.status(404).json({
				error: error,
			});
		});
};

// Supprimer images quand modifier
exports.modifyThing = (req, res, next) => {
	// Function permmetant de modifier un thing
	// Récupération de la reponse l'id d'une Thing (un sauce)
	Thing.findOne({ _id: req.params.id }).then((thing) => {
		// Va supprimer l'image quand utilisé.
		const filename = thing.imageUrl.split('/images/')[1];
		// `images/${filename}` indique l'image à supprimer.
		fs.unlink(`images/${filename}`, () => {
			// Supprimer limage
			Thing.deleteOne({ imageUrl: req.params.imageUrl })
				.then(() => res.status(200))
				.catch((error) => res.status(400).json({ error }));
		});
	});
	// thingObject corespond à si il y a modification recupere les changement du body puis met a jour la DB
	const thingObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get('host')}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	Thing.updateOne(
		{ _id: req.params.id },
		{ ...thingObject, _id: req.params.id },
	)
		.then(() => res.status(200).json({ message: 'Objet modifié !' }))
		.catch((error) => res.status(400).json({ error }));
};

exports.deleteThing = (req, res, next) => {
	Thing.findOne({ _id: req.params.id })
		// Récupération la reponse
		.then((thing) => {
			// si réponse on recupere le chemin d'access de l'image
			const filename = thing.imageUrl.split('/images/')[1];
			// `images/${filename}` indique l'image à supprimer.
			fs.unlink(`images/${filename}`, () => {
				// on supprime tout le thing (la sauce)
				Thing.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: 'Objet supprimé !' }))
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

exports.getAllStuff = (req, res, next) => {
	// Va chercher tout les Things sur la DB si réponse affiche les.
	Thing.find()
		.then((things) => {
			res.status(200).json(things);
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};

// En cours
exports.likesThings = (req, res, next) => {
	Thing.findOne({ _id: req.params.id })
		// Récupération la reponse de la DB de l'id de la thing selectionner
		.then((thing) => {
			// Recuperer les valeurs du front qui sera (1(like), 0(annulation), -1(dislike))
			const bodylikes = req.body.like;
			// Recuperer l'userId
			const userId = req.body.userId;

			// Créer un
			const nouvelleValeur = {
				// recupere valeur DB
				likes: thing.likes,
				dislikes: thing.dislikes,
				usersLiked: thing.usersLiked,
				usersDisliked: thing.usersDisliked,
			};

			// Ecoute la reponse de bodylikes
			switch (bodylikes) {
				case 1:
					// Si c'est un ajoute +1 à likes et ajoute l'userId de la personne qui a like dans usersLiked
					nouvelleValeur.likes += 1;
					nouvelleValeur.usersLiked.push(userId);
					break;

				case 0:
					// Si c'est zero
					// et si usersLikes contient userId retire 1 et enleve le userId
					if (thing.usersLiked.includes(userId)) {
						nouvelleValeur.likes -= 1;
						nouvelleValeur.usersLiked.remove(userId);
					}
					// Sinon si usersDislikes contient userId retire 1 et enleve le userId
					else if (thing.usersDisliked.includes(userId)) {
						nouvelleValeur.dislikes -= 1;
						nouvelleValeur.usersDisliked.remove(userId);
					}
					console.log(nouvelleValeur);
					break;

				case -1:
					// Si c'est moins un ajoute +1 à disLikes et ajoute l'userId de la personne qui a dislikes dans usersLiked
					nouvelleValeur.dislikes += 1;
					nouvelleValeur.usersDisliked.push(userId);

					break;
			}
			// Renvoie les nouvelles valeurs à la database.
			Thing.updateOne({ _id: req.params.id }, { ...nouvelleValeur })
				.then(() => res.status(200).json({ message: 'Like ajouté !' }))
				.catch((error) => res.status(400).json({ error }));
		})
		.catch((error) => {
			res.status(400).json({
				error: error,
			});
		});
};
