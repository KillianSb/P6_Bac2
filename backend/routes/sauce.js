const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const router = express.Router();

//Ajout lien sauce controller
const sauceCtrl = require('../controllers/sauce');

//Affichage des sauces
router.get('/', auth, sauceCtrl.getAllSauce);
//Création de la sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
//Affichage de la sauce
router.get('/:id', auth, sauceCtrl.getOneSauce);
//Modification de la sauce
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
//Suppression de la sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//Modification des likes/dislikes
router.post("/:id/like", auth, sauceCtrl.likeDislike);

module.exports = router;