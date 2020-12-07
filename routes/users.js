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
/* GET users/sign-up. = s'inscrire */
router.post('/sign-up', async function(req, res, next) {

  console.log('Route sign up');
  email = req.body.email.toLowerCase();
  // console.log('login = ', login);
  // console.log('req.body = ', req.body);

  var response = {response : false};

  // on cherche email dans la Base de données
  var test = await getUser({email})
  console.log('test=', test);
  if ( test != null){
    response.error = 'email is used';

  } else {

    //creation une compte nouvelle
    var newUser = await createUser(req.body);
    console.log(newUser);
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
/* POST /users/sign-in (se loguer)*/

router.post('/sign-in', async function(req, res, next) {

  console.log('Route sign in');
  email = req.body.email.toLowerCase();
  console.log('email = ', email);

  var response = {response : false};

  var newUser = await getUser({email})
  console.log('user=', newUser);

  if ( newUser == null ){
    response.error = 'login does not exist';

  } else if (newUser.password === SHA256(req.body.password + newUser.salt).toString(encBase64) ) {

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
      response.token = newUser.token;
    }else{
      response.error = 'wrong password';
    }
  
  res.json(response);
});





/* -----------------  */
/* GET users/update   */
router.post('/update', async function(req, res, next) {

  console.log('Route update');
  token = req.body.token;
  console.log('token = ', token);
  var response = {response : false};
  
  var oldUser = await getUser({token});
  if (oldUser === null){
    response.error = 'wrong token';
  } else {

    var updetedUser = await updateUser(oldUser , req.body);
    console.log('updetedUser=', updetedUser)

    var resBD = await updateUserByToken(token, updetedUser);
    console.log("resBD=", resBD);

    if ( ! resBD.status ){
      response.error = resBD;
    }else{
      response.response = true;
      response.token = token;
    }
  }
  res.json(response);
});




/* -----------------  */
/* GET users/delete   */
router.post('/delete', async function(req, res, next) {

  console.log('Route delete');
  token = req.body.token;
  console.log('token = ', token);
  
  var response = {response : false};
  
  var appDelUser = deleteUserFromApp (await getUser({token}));
  
  if( ! appDelUser) {
    console.log("can't delete the user. Email= ", req.body.email);
    response.error = "Backend can't delete the user"
  } else{ 
  
    var resBD = await deleteOne(token);
    
    if ( ! resBD.status ){
      response.error = resBD;
    }else{
      response.response = true;
      response.token = token;
    }
  }
  res.json(response);
});




/* -----------------  */
/* GET users/getAvatars   */
router.post('/getAvatars', async function(req, res, next) {

  console.log('Route getAvatars');
  token = req.body.token;
  console.log('token = ', token);
  
  var response = {response : false};


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

async function updateUserByToken(token, updatedUser){
  var reponse = {status : false};
  try{
    reponse.user = await users.updateOne({token}, updatedUser);
    reponse.status = true;
  }catch(e){
    console.log(e);
    reponse.error = e;
  }
  return reponse;
}
async function deleteOne(token){
  var reponse = {status : false};
  try{
    reponse.user = users.deleteOne({token});
    reponse.status = true;
  }catch(e){
    console.log(e);
    reponse.error = e;
  }
  return reponse;
}

async function createUser(obj){

  var salt = uid2(32);
  var newUser = new users ({
    salt : salt,
    token : uid2(32),
    nom : obj.nom,
    prenom : obj.prenom,
    email : obj.email.toLowerCase(),
    password : SHA256(obj.password + salt).toString(encBase64),
    avatar : obj.avatar,
    ville : obj.ville,
    age : obj.age,
    amis : [],
    groupes : [],
    conversations : [],
    preferences : '',
    confidentialite : '',
    favoris : [],
    sorties : [],
  });

  var response = {};
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
  console.log(data);
  if (data.nom != null){
    userUpdated.nom = data.nom;
  }
  if (data.prenom != null){
    userUpdated.prenom = data.prenom;
  }
  if (data.email != null){
    userUpdated.email = data.email.toLowerCase();
  }
  if (data.password != null){
    userUpdated.password = SHA256(data.password + data.salt).toString(encBase64)
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


function deleteUserFromApp (user){
  var result = false;
  console.log('delete user from App');
  //
  // instrutions pour supprimer les traces de l'utilisateur 'user'
  // il faut discouter dans l'equipe
  //
  return result;
}



module.exports = router;
