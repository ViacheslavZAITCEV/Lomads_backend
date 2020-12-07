var express = require('express');
var router = express.Router();

var uid2 = require('uid2');
var SHA256 = require('crypto-js/sha256');
var encBase64 = require('crypto-js/enc-base64');
var users = require('../models/users');




// *************************************************
//
//          - = ROUTES = -
// 
// *************************************************

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});




/* -----------------  */
/* GET users/sign-up. */
router.post('/sign-up', async function(req, res, next) {

  console.log('Route sign up');
  login = req.body.login;
  // console.log('login = ', login);
  // console.log('req.body = ', req.body);

  var response = {response : false};

  // on cherche email dans la Base de données
  var test = await getUser({login})
  console.log('test=', test);
  if ( test != null){
    response.error = 'login is used';

  } else {

    //creation une compte nouvelle
    var newUser = await createUser(req);
    if( newUser.status){

      // on prepare la reponse pour frontend
      response.response = true;
      response.token = newUser.token;
      response.nom = newUser.nom;
      response.prenom =  newUser.prenom;
      response.avatar = newUser.avatar;
      response.ville  = newUser.ville;
      response.preferences  = newUser.preferences;
      response.groupes  = newUser.groupes;
      response.eventsFavoris  = newUser.favoris;
      response.sorties  = newUser.sorties;
      response.amis  = newUser.amis;
      response.confidentialite  = newUser.confidentialite;
      response.age = newUser.age;
    }else{
      response.error = 'error of BD: ' + newUser.error;
    }
  }
  
  res.json(response);
});




/* -----------------  */
/* GET users sign-in. */

router.post('/sign-in', async function(req, res, next) {

  console.log('Route sign in');
  login = req.body.login;
  console.log('login = ', login);

  var response = {response : false};

  var newUser = await getUser({login})
  console.log('user=', newUser);

  if ( newUser == null ){
    response.error = 'login does not exist';

  } else if (req.body.password === newUser.SHA256(req.body.password + req.body.salt).toString(encBase64) ) {

    if( newUser.status){
      response.response = true;
      response.token = '';
      response.nom = newUser.nom;
      response.prenom =  newUser.prenom;
      response.avatar = newUser.avatar;
      response.ville  = newUser.ville;
      response.preferences  = newUser.preferences;
      response.groupes  = newUser.groupes;
      response.eventsFavoris  = newUser.favoris;
      response.sorties  = newUser.sorties;
      response.amis  = newUser.amis;
      response.confidentialite  = newUser.confidentialite;
      response.age = newUser.age;
      response.token = newUser.token;
    }else{
      response.error = 'error of BD: ' + newUser.error;
    }
  }
  
  res.json(response);
});





/* -----------------  */
/* GET users/update   */
router.post('/update', async function(req, res, next) {

  console.log('Route update');
  token = req.body.token;
  console.log('token = ', token);
  
  var oldUser = await getUser({token})
  var updetedUser = await updateUser(oldUser , req.body);

  var response = {response : false};
  var resBD = await updateUserByToken(token, updetedUser);

  if ( ! resBD.status ){
    response.error = resBD;
  }else{
    response.response = true;
    response.token = token;
  }
  res.json(response);
});





//--------------------------------------------------
//
//          - = FUNCTIONS = -
// 
//--------------------------------------------------
// *************************************************

async function getUser(obj){
  var reponse;
  try{
    reponse = users.findOne(obj);
  }catch(e){
    console.log(e);
    reponse = e;
  }
  return reponse;
}

async function updateUserByToken(token, updateddUser){
  var reponse = {status : false};
  try{
    reponse.user = users.updateOne({token}, updateddUser);
    reponse.status = true;
  }catch(e){
    console.log(e);
    reponse.error = e;
  }
  return reponse;
}

async function createUser(req){

  var salt = uid2(32);
  var newUser = {
    salt : salt,
    token : uid2(32),
    nom : req.body.nom,
    prenom : req.body.prenom,
    email : req.body.email,
    password : SHA256(req.body.password + req.body.salt).toString(encBase64),
    avatar : '',
    ville : req.body.ville,
    age : req.body.age,
    amis : [],
    groupes : [],
    conversations : [],
    preferences : '',
    confidentialite : '',
    favoris : [],
    sorties : [],
  };

  var response;
  try{
    response.status = true;
    response.user = await newUser.save();
  }catch(e){
    console.log(e)
    response.status = false;
    response.error = e;
  }
  return response;
}


function updateUser(userUpdated, data){
  if (data.nom != null){
    userUpdated.nom = data.nom;
  }
  if (data.prenom != null){
    userUpdated.prenom = data.prenom;
  }
  if (data.email != null){
    userUpdated.email = data.email;
  }
  if (data.password != null){
    userUpdated.password = data.password;
  }
  if (data.avatar != null){
    userUpdated.avatar = data.avatar;
  }
  if (data.ville != null){
    userUpdated.ville = data.ville;
  }
  if (data.age != null){
    userUpdated.age = data.age;
  }
  if (data.preferences != null){
    userUpdated.preferences = data.preferences;
  }
  if (data.groupes != null){
    userUpdated.groupes = data.groupes;
  }
  if (data.confidentialite != null){
    userUpdated.confidentialite = data.confidentialite;
  }
  if (data.favoris != null){
    userUpdated.favoris = data.favoris;
  }
  if (data.sorties != null){
    userUpdated.sorties = data.sorties;
  }
  return userUpdated;
}



module.exports = router;
