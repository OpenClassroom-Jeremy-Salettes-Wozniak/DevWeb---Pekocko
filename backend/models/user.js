// TODO: User.js (Model)
// import mongoose (DB)
const mongoose = require('mongoose');
// import uniqueValidator (Renforcement du caractere unique de l'email)
const uniqueValidator = require('mongoose-unique-validator');

// Créer un model d'user( Un utilisateur )
const userSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
});

// Utilisation de uniqueValidator
userSchema.plugin(uniqueValidator);

// Export le model dans le user.js du controllers
module.exports = mongoose.model('User', userSchema);
