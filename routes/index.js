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
router.post('/pullEventDetaille', async function(req, res, next) {
  console.log("req post id recup", req.body.id)
  const event = await eventModel.findById(req.body.id)
 
  res.json(event);
});


// Route pour ajout de like :  ajouter l'id de l'utilisateur à la liste des likes de l'évènement et ajouter l'id du film au tableau de likes de l'utilisateur
// TESTE POSTMAN : OK
router.get('/likeEvent', async function(req, res, next) {

  console.log("event",req.query.idEvent)
  console.log("user",req.query.idUser)

  var idEvent = req.query.idEvent;
  var idUser = req.query.idUser

  
  eventModel.findOneAndUpdate(
    { _id: idEvent }, 
    { $push: {popularite: idUser}},
      function (error, success) {
        if (error) {
            console.log("ERROR EVENT",error);
        } else {
            console.log("SUCCESS EVENT", success);
        }
    });

  userModel.findOneAndUpdate(
    { _id: idUser }, 
    { $push: {favoris: idEvent}},
      function (error, success) {
        if (error) {
            console.log("ERROR USER",error);
        } else {
            console.log("SUCCESS USER", success);
        }
    });

    const event= eventModel.findById(idEvent)
    const user= userModel.findById(idUser)
 
    console.log("VERIF POPULARITE EVENT", event.popularite)
    console.log("VERIF LIKE USER", user.favoris)
    
  res.json({event:event.popularite, user: user.favoris});
});


// Route pour retrait de like :  ajouter l'id de l'utilisateur à la liste des likes de l'évènement et ajouter l'id du film au tableau de likes de l'utilisateur
// TESTE POSTMAN : OK
router.get('/unlikeEvent', async function(req, res, next) {

  console.log("event",req.query.idEvent)
  console.log("user",req.query.idUser)

  var idEvent = req.query.idEvent;
  var idUser = req.query.idUser

  eventModel.findOneAndUpdate(
    { _id: idEvent }, 
    { $pull: {popularite: idUser}},
      function (error, success) {
        if (error) {
            console.log("ERROR EVENT",error);
        } else {
            console.log("SUCCESS EVENT", success);
        }
    });
    
   userModel.findOneAndUpdate(
    { _id: idUser }, 
    { $pull: {favoris: idEvent}},
      function (error, success) {
        if (error) {
            console.log("ERROR USER",error);
        } else {
            console.log("SUCCESS USER", success);
        }
    });

    const event= eventModel.findById(idEvent)
    const user= userModel.findById(idUser)
 
    console.log("VERIF POPULARITE EVENT", event.popularite)
    console.log("VERIF LIKE USER", user.favoris)
    
  res.json({event:event.popularite, user: user.favoris});
});



  
















































// ---------------------------------------ADMINISTRATION DE LA BDD VIA POSTMAN------------------------------------------
router.post('/addevent', async function(req, res, next) {
  //Ajout d'un évènement avec un créneau 
    var newEvent = new eventModel ({
      nom: req.body.nom,
      type: req.body.type,
      categories: req.body.categorie,
      description: req.body.description,
      image: req.body.img,
      image_public_id: req.body.imgPublicId,
      popularite: req.body.popularite,
      lieux_dates: [{
        salle: req.body.salle,
        adresse: req.body.adresse,
        cp: req.body.cp,
        date_debut: req.body.dateDebut,
        date_fin: req.body.dateFin,
        duree: req.body.duree}],
  
  });
  
    var event = await newEvent.save();
    res.render('index', { event:event });
  });
  
  
    router.post('/addeventlieu', async function(req, res, next) {
  //Ajout de créneaux à un évènement spécifique via son id
   var idEvenement = '5fce47f76697a656d4d4ea77'
      eventModel.findOneAndUpdate(
        { _id: idEvenement }, 
        { $push: {lieux_dates:{ salle: req.body.salle,
          adresse: req.body.adresse,
          cp: req.body.cp,
          date_debut: req.body.dateDebut,
          date_fin: req.body.dateFin,
          duree: req.body.duree  }} },
       function (error, success) {
             if (error) {
                 console.log("ERROR",error);
             } else {
                 console.log("SUCCESS", success);
             }
         });
    
    res.render('index');
  });
  
module.exports = router;
