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
/* GET users sign-in. */
router.post('/sign-in', async function(req, res, next) {

  console.log('Route sign in');
  login = req.body.login;
  console.log('login = ', login);

  var response = {response : false};

  if ( await getUserLogin(login) != 0){
    response.error = 'login is used';

  } else {

    var newUser = await createUser(req);
    if( newUser.status){
      response.user = newUser.user;
    }else{
      response.error = 'error of BD: ' + newUser.error;
    }
  }
  
  res.json(response);
});




/* -----------------  */
/* GET users sign-up. */





//--------------------------------------------------
//
//          - = FUNCTIONS = -
// 
//--------------------------------------------------
// *************************************************

async function getUserLogin(email){
  var reponse;
  reponse = users.find({email});
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
    avatarpreferences : '',
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

module.exports = router;
