const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth')
const multer = require('../middleware/multer-config')


router.post('/',auth,multer, sauceCtrl.createSauce);//crée une sauce et initilise les différents attributs de cette dernière.

router.post('/:id/like',sauceCtrl.likeASauce)// Gère les likes des sauces.

router.delete('/:id', sauceCtrl.deleteSauce);//supprime une sauce
/*
router.put('/:id', sauceCtrl.updateOneSauce);//met à jour une sauce
*/

router.get('/', sauceCtrl.getAllSauces);//Récupère toutes les sauces

router.get('/:id', sauceCtrl.getOneSauce);//reçois une sauce unique





module.exports = router;