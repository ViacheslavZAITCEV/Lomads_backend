var express = require('express');
var router = express.Router();

var userModel = require('../models/users')
var eventModel = require('../models/events')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


// Route pour récupérer l'ensemble des évènements --> SCREEN des évènements
// TESTE POSTMAN : OK
router.get('/pullEvents', async function(req, res, next) {

  const events = await eventModel.find()
  
  res.json(events);
});


// Route pour récupérer un évènement spécifiquement --> SCREEN de la carte évènement détaillée
// TESTE POSTMAN : OK
router.get('/pullEventDetaille', async function(req, res, next) {

  const event = await eventModel.findById(req.query.id)
 
  res.json(event);
});


module.exports = router;
