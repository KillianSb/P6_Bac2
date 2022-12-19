const express = require('express');
const router = express.Router();

//Ajout lien user controller
const userControllers = require('../controllers/user');

//Enregistrement user
router.post('/signup', userControllers.register);
//Connection user
router.post('/login', userControllers.login);

module.exports = router;