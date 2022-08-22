//TODO: Routes stuff.js (Evenement)
// import Express
const express = require('express');
const router = express.Router();

// import les middleware(control) et l'objet
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const stuffCtrl = require('../controllers/stuff');

// L'pplication va utilisé URI et les functions importer
// auth verifie que user et connecter pour effectuer l'action
// multer permet à l'user de télécharger une image de leurs ordinateurs

// '/' fait appel à tous les articles
router.get('/', auth, stuffCtrl.getAllStuff); // Affichage des articles
router.post('/', auth, multer, stuffCtrl.createThing); // Création d'article
// '/:id' fait appel à un article
router.get('/:id', auth, stuffCtrl.getOneThing); // Affichage de l'article
router.put('/:id', auth, multer, stuffCtrl.modifyThing); // Modification de l'article
router.delete('/:id', auth, stuffCtrl.deleteThing); // Suppression de l'article
router.post('/:id/like', auth, stuffCtrl.likesThings); // Boute j'aime ou J'aime pas

// Export routes dans APP.JS
module.exports = router;
