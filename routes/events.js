var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var userModel = require('../models/users')
var eventModel = require('../models/events')


// Route pour récupérer l'ensemble des évènements --> SCREEN des évènements
// TESTE POSTMAN : OK
router.get('/pullEvents', async function (req, res, next) {
  const events = await eventModel.find()
  // console.log('route pullEvents', events);
  res.json(events);
});





router.post('/setEvent', async (req, res, next)=>{

  let response = { response: false, error: 'init'};
  const TOKEN_USER =  req.body.token

  console.log('req.body.token=', req.body.token);

  const NEW_EVENT = await createEvent ({
    nom: req.body.eventName,
    type: req.body.type,
    description: req.body.description,
    image: "",
    popularite: [TOKEN_USER],
    lieux_dates: [{
      adresse: req.body.address,
      date_debut: req.body.date,
      date_fin: req.body.date,
      duree: 0,
  }],
  });
  console.log('new event=', NEW_EVENT)
  response.response = NEW_EVENT.status;
  response.event = NEW_EVENT.event
  response.error = NEW_EVENT.error

  console.log('response=', response);
  res.json(response)
})









/*
------------------------------------------
------------------------------------------
                FUNCTIONS
==========================================                    
==========================================                    
==========================================                    
*/

const createEvent = async (event)=>{
  let response = {status: false}
  let newEvent = new eventModel (event)

  try{
    response.event = await newEvent.save();
    response.status = true
  }catch(e){
    console.log(e);
    response.status = false;
    response.error = e;
  }

  return response
}









module.exports = router;
