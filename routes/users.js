var express = require('express');
var router = express.Router();

var uid2 = require('uid2');
var SHA256 = require('crypto-js/sha256');
var encBase64 = require('crypto-js/enc-base64');

var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dhtl1axxt', 
  api_key: '793539215191737', 
  api_secret: 'uY4c6T5Cg0MfWEZ-gB7gSryDxuU' 
});

var users = require('../models/users');
// var conversations = require('../models/conversations');
const { render } = require('ejs');




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
  var response = {response : false};
  var emailRef =  req.body.email;
  console.log(emailRef);
  if (emailRef == null || emailRef == undefined){
    response.error = 'email is null or undefined';
  }else{
  
    var email = emailRef.toLowerCase();

    // on cherche email dans la Base de données
    var test = await getUser({email})
    console.log('test=', test);
    if ( test != null){
      response.error = 'email is used';

    } else {

      //creation une compte nouvelle
      console.log('body : ', req.body)
      var newUser = await createUser({
        nom : req.body.nom, 
        prenom : req.body.prenom, 
        email : email, 
        password : req.body.password,
        ville :  req.body.ville});
      console.log('newUser =', newUser);
      
      if( newUser.status){

        // on prepare la reponse pour frontend
        response.response = true;
        response.token = newUser.user.token;
        response.nom = newUser.user.nom;
        response.prenom =  newUser.user.prenom;
        response.avatar = newUser.user.avatar;
        response.ville  = newUser.user.ville;
        response.preferences  = newUser.user.preferences;
        response.groupes  = newUser.user.groupes;
        response.eventsFavoris  = newUser.user.favoris;
        response.sorties  = newUser.user.sorties;
        response.amis  = newUser.user.amis;
        response.confidentialite  = newUser.user.confidentialite;
        response.age = newUser.user.age;
      }else{
        response.error = 'error of BD: ' + newUser.error;
      }
    }
  }
  console.log('response =', response);
  res.json(response);
});




/* -----------------  */
/* POST /users/sign-in (se loguer)*/

router.post('/sign-in', async function(req, res, next) {

  console.log('Route sign in');
  var response = {response : false};
  var emailRef =  req.body.email;
  console.log(emailRef);
  if (emailRef == null || emailRef == undefined){
    response.error = 'email is null or undefined';
  }else{
    var email = req.body.email.toLowerCase();
    console.log('email = ', email);
    var userBD = await getUser({email})
    console.log('userBD=', userBD);

    if ( userBD == null ){
      response.error = 'email does not exist';

    } else if (userBD.mot_de_passe === SHA256(req.body.password + userBD.salt).toString(encBase64) ) {
      // password : SHA256(obj.password + salt).toString(encBase64),
        response.response = true;
        response.token = userBD.token;
        response.nom = userBD.nom;
        response.prenom =  userBD.prenom;
        response.avatar = userBD.avatar;
        response.ville  = userBD.ville;
        response.preferences  = userBD.preferences;
        response.groupes  = userBD.groupes;
        response.eventsFavoris  = userBD.favoris;
        response.sorties  = userBD.sorties;
        response.amis  = userBD.amis;
        response.confidentialite  = userBD.confidentialite;
        response.age = userBD.age;

      }else{
        response.error = 'wrong password';
      }
    }
  res.json(response);
});






/* -----------------  */
/* POST users/getUser   */
router.post('/getUser', async function(req, res, next) {
  
  console.log('users/getUser');

  var requet = {};
  if (req.body.token !==undefined){
    requet.token = req.body.token;
  }
  console.log('token = ', requet.token);
  if (req.body.email !==undefined){
    requet.email = req.body.email;
  }
  if (req.body.nom !==undefined){
    requet.nom = req.body.nom;
  }
  if (req.body.prenom !==undefined){
    requet.prenom = req.body.prenom;
  }

  var response = {response : false};
  var userBD = await getUser({requet});
  if (userBD){
    if (userBD.token){
      response.response = true;
      response.token = userBD.token;
      response.nom = userBD.nom;
      response.prenom =  userBD.prenom;
      response.avatar = userBD.avatar;
      response.ville  = userBD.ville;
      response.preferences  = userBD.preferences;
      response.groupes  = userBD.groupes;
      response.eventsFavoris  = userBD.favoris;
      response.sorties  = userBD.sorties;
      response.amis  = userBD.amis;
      response.confidentialite  = userBD.confidentialite;
      response.age = userBD.age;
      response._id = userBD._id;
    }else{
      response.error = userBD;
    }
  }else{
    response.error = 'token inconnu';
  }
  res.json(response);
});

/* -----------------  */
/* POST users/update   */
router.post('/update', async function(req, res, next) {

  console.log('Route update');
  var token = req.body.token;
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
router.get('/delete', async function(req, res, next) {

  console.log('Route delete');
  var token = req.body.token;
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
router.get('/getAvatars', async function(req, res, next) {

  console.log('Route getAvatars');
  var token = req.body.token;
  var token = 'pDJQWG4ievDB0ANHH1X3MCGKHBXDw37G';
  console.log('token = ', token);
  
  var response = {response : false};

  var amisParisTab = await users.find({token});

  var amisParis = amisParisTab.map( (user, i)=>{
    return user._id;
  });

  try{
    var resBD = await users
      .find({ville : 'Paris'})
      .populate('avatar')
      .exec( (err, amis)=>{
        if (err) {
          console.log('error=', err);
        }else{
          amis = amisParis;
          // amisParis.push(avatar);
        }
      })
  }catch(e){
    console.log(e);
  }
  console.log('amisParis =', amisParis);
  console.log('resBD=', resBD);

  res.json(response);
});





/* -----------------  */
/* GET users/renderUsersAleatoires   */
/* Creation base de donnée d'utilisateur */
router.get('/renderUsersAleatoires', async function(req, res, next) {

  console.log('Route renderUsersAleatoires');
  var qtte = 0;
  if (req.query.quantite !== undefined){
    qtte = req.query.quantite;
  };

  var villes = ['Paris', 'Marseille', 'Nantes', 'Rouen', 'Havre', 'La Rochelle', 'Toulouse', 'Paris', 'Paris', 'Paris', 'Paris'];
  var prenomsMasc = ['Pierre', 'Jean-Paul', 'Michel', 'Emmanuel', 'Dominique', 'Nicols', 'Léa', 'Manon', 'Claud', 'Sylvin', 'Beatrice', 'Eduard', 'Antoin', 'Jean'];
  var prenomsFemin = ['Marie', 'Candice', 'Michelle', 'Emmanuelle', 'Dominique', 'Suzy', 'Claire', 'Alexandra', 'Mylene', 'Melissa', 'Clara', 'Lisa', 'Sonia', 'Raphaelle'];
  var noms = ['Dupont', 'Dubois', 'Dujardin', 'Dumanoir', 'Dulac', 'Macron', 'Coustaud', 'Custeau', 'Sezane', 'Parmentier', 'Hausman'];
  var lettres = 'abcdefghijklmnoprstuvwxyz';
  var avatarMasc = ['001-boy.png', '002-boy.png', '027-boy.png', '028-man.png', '029-boy.png', '031-boy.png', '032-man.png', '033-man.png', '034-boy.png', '035-boy.png', '036-boy.png', '037-man.png', '038-boy.png', '039-boy.png', '040-man.png', '041-boy.png', '042-boy.png', '043-boy.png', '044-boy.png', '045-man.png', '046-man.png', '047-man.png', '048-man.png', '049-boy.png', '050-boy.png'];
  var avatarFemin = ['003-woman.png', '004-woman.png', '005-woman.png', '006-woman.png', '007-woman.png', '008-woman.png', '009-woman.png', '010-woman.png', '011-woman.png', '012-woman.png', '013-woman.png', '014-woman.png', '015-woman.png', '016-woman.png', '017-woman.png', '018-woman.png', '019-woman.png', '020-woman.png', '021-woman.png', '022-woman.png', '023-woman.png', '024-woman.png', '025-woman.png', '026-woman.png'];

  var result = [];
  var compt = 0;
  var path = '../../inTouch/public/images/avatars/'
  // var path = './routes/avatars/'
  while (compt < qtte) {

    // profil masculin
    var nom =  noms[render(noms.length)];
    var prenom = prenomsMasc[render(prenomsMasc.length)];
    var avatar = await getUrlCloud(path + avatarMasc[render(avatarMasc.length)]);
    var ville = villes[render(villes.length)];
    var email = lettres.charAt( render( lettres.length )) +  lettres.charAt( render( lettres.length )) + '@gmail.fr'
    var newUser = await createUser({nom, prenom, avatar, ville, email, password : email});
    if ( newUser.status ){
      compt++;
      result.push(newUser.user);
    }
    // profil feminin
    var nom =  noms[render(noms.length)];
    var prenom = prenomsFemin[render(prenomsFemin.length)];
    var avatar = await getUrlCloud(path + avatarFemin[render(avatarFemin.length)]);
    var ville = villes[render(villes.length)];
    var email = lettres.charAt( render( lettres.length )) +  lettres.charAt( render( lettres.length )) + '@gmail.fr'
    var newUser = await createUser({nom, prenom, avatar, ville, email, password : email});
    if ( newUser.status ){
      compt++;
      result.push(newUser.user);
    }
    
  }
  
  function render(max){
    return Math.floor(Math.random()*max);
  }


  res.json(result);
});



/* -----------------  */
/* GET users/remplirAmis   */
/* Comleter la base de donnée d'utilisateur */
// router.get('/remplirAmis', async function(req, res, next) {
//   var groupAmiParis = await users.find({ville : 'Paris'});
//   console.log('groupAmiParis=', groupAmiParis);
//   var amisParis = [];
//   for (var ami of groupAmiParis){
//     ami.amis = amisParis;
//     amisParis.push(ami.id);
//   }
//   console.log('changement est passee. groupAmiParis=', groupAmiParis);
//   var reponse = await users.updateMany({ville : 'Paris'}, amisParis);
//   res.json(reponse);
// });


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

  console.log('obj.nom: ', obj.nom);
  console.log('obj.email: ', obj.email);
  console.log('obj.prenom: ', obj.prenom);

  // avatar 'standart' from font Awesome: https://fontawesome.com/icons/user 
  var newUser = new users ({
    salt : salt,
    token : uid2(32),
    nom : obj.nom,
    prenom : obj.prenom,
    email : obj.email,
    mot_de_passe : SHA256(obj.password + salt).toString(encBase64),
    avatar : 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png',
    ville : obj.ville,
    amis : [],
    groupes : [],
    conversations : [],
    preferences : [{
      cinema : false,
      theatre: false,
      exposition: false,
      concert: false,

      fantastique: false,
      scienceFiction:  false,
      comedie: false,
      drame: false,
      spectacleMusical: false,
      contemporain: false,
      oneManShow: false,
      musiqueClassique: false,
      musiqueFrancaise: false,
      musiquePop: false,
      musiqueRock: false,
      beauxArts : false,
      histoireCivilisations: false,
  }],
    confidentialite : true,
    favoris : [],
    sorties : []
  });

  console.log('obj to BD :', newUser);
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
    userUpdated.preferences = data.preferences.toLowerCase();
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

function getUrlCloud(path){
  var saveCloudRes;
  console.log('save to Cloudinary file='+path);
  console.log(path)
  cloudinary.uploader.upload(path, 
    function (error, result) {
      saveCloudRes = result;
      console.log('error : ', error);
      console.log('saved to Cloudinary', saveCloudRes)
      return saveCloudRes;
  }); 
}


async function deleteUserFromApp (user){
  var result = false;
  console.log('delete user from App');
  //

  // il faut discouter dans l'equipe

  //  ****************************
  // console.log("event",req.query.idEvent)
  // console.log("user",req.query.idUser)

  // var idEvent = req.query.idEvent;
  // var idUser = req.query.idUser

  // eventModel.findOneAndUpdate(
  //   { _id: idEvent }, 
  //   { $pull: {popularite: idUser}},
  //     function (error, success) {
  //       if (error) {
  //           console.log("ERROR EVENT",error);
  //       } else {
  //           console.log("SUCCESS EVENT", success);
  //       }
  //   });
  // *******************************
  
  // instrutions pour supprimer les traces de l'utilisateur 'user'
  if (user !== null){

    // delFrends from mes Amis
    // version 1
    for (var ami of user.amis){
      await users.updateOne({'id' : ami.id}, {$pull : {amis : user.id}});
    }

    // version 2
    // await users.updateMany({amis : user.id }, {$pull : {amis : user.id}});
    

    // supprimer id d'user des conversations
    for (var disc of user.conversations){
      await conversations.updateOne({'id' : disc.id},  {$pull : {auteur : user.id}} );
    }
  }
  

  // users.findOne(
  //   {"_id" : user._id}, // filter de recherche 
  //   { }
  //   )

  //
  // retirer user des conversation suivantes: user.conversations[]
  // retirer user des amis suivantes: user.amis[]
  //
  return result;
}



module.exports = router;
