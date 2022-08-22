// TODO: Thing.js (Model)
// import mongoose (DB)
const mongoose = require('mongoose');

// Créer un model d'objet( Une sauce )
const thingSchema = mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
	manufacturer: { type: String, required: true },
	description: { type: String, required: true },
	mainPepper: { type: String, required: true },
	imageUrl: { type: String, required: true },
	heat: { type: Number, required: true },
	likes: { type: Number, required: true },
	dislikes: { type: Number, required: true },
	usersLiked: { type: [String] },
	usersDisliked: { type: [String] },
});

// Export le model dans le stuff.js du controllers
module.exports = mongoose.model('Thing', thingSchema);
