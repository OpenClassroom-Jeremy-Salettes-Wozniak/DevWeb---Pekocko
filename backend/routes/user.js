//TODO: Routes user.js (Evenement)
// import Express
const express = require('express');
const router = express.Router();

// import controller user.js (Function)
const userCtrl = require('../controllers/user');

const rateLimit = require('express-rate-limit');

// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);

const apiLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // start blocking after 5 requests
});

const createAccountLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour window
	max: 1, // start blocking after 5 requests
	message:
		'Too many accounts created from this IP, please try again after an hour',
});

// Evenement CRUD
router.post('/signup', createAccountLimiter, userCtrl.signup);
router.post('/login', apiLimiter, userCtrl.login);

// Export routes dans APP.JS
module.exports = router;
