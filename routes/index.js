var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');

var userModel = require('../models/users')
var eventModel = require('../models/events')
var sortieModel = require('../models/sorties')
var friendRequestModel = require('../models/friendRequest')

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


// Route pour récupérer l'ensemble des évènements --> SCREEN des évènements
// TESTE POSTMAN : OK
router.get('/pullEvents', async function (req, res, next) {
  const events = await eventModel.find()
  // console.log('route pullEvents', events);
  res.json(events);
});


// Route pour récupérer un évènement spécifiquement --> SCREEN de la carte évènement détaillée
// TESTE POSTMAN : OK
router.post('/pullEventDetaille', async function (req, res, next) {
  // console.log("req post id recup", req.body.id)
  const event = await eventModel.findById(req.body.id)
  res.json(event);
});


// Route pour ajout de like :  ajouter l'id de l'utilisateur à la liste des likes de l'évènement et ajouter l'id du film au tableau de likes de l'utilisateur
// TESTE POSTMAN : OK
router.get('/likeEvent', async function (req, res, next) {

  // console.log("event", req.query.idEvent)
  // console.log("user", req.query.idUser)
  // console.log("token", req.query.token)

  var idEvent = req.query.idEvent;
  var idUser = req.query.idUser;
  var token = req.query.token;

  var event;
  var user;

  try {
    eventModel.findOneAndUpdate(
      { _id: idEvent },
      { $push: { popularite: idUser } },
      function (error, success) {
        if (error) {
          console.log("ERROR EVENT", error);
        } else {
          console.log("SUCCESS EVENT", success);
        }
      });

    userModel.findOneAndUpdate(
      { _id: idUser },
      { $push: { favoris: idEvent } },
      function (error, success) {
        if (error) {
          console.log("ERROR USER", error);
        } else {
          console.log("SUCCESS USER", success);
        }
      });
    event = eventModel.findById(idEvent);
    user = userModel.findById(idUser);

  } catch (e) {
    // console.log(e);
  }
  res.json({ event: event.popularite, user: user.favoris });
});


// Route pour retrait de like :  ajouter l'id de l'utilisateur à la liste des likes de l'évènement et ajouter l'id du film au tableau de likes de l'utilisateur
// TESTE POSTMAN : OK
router.get('/unlikeEvent', async function (req, res, next) {

  var idEvent = req.query.idEvent;
  var idUser = req.query.idUser;

  var event;
  var user;

  eventModel.findOneAndUpdate(
    { _id: idEvent },
    { $pull: { popularite: idUser } },
    function (error, success) {
      if (error) {
        console.log("ERROR EVENT", error);
      } else {
        console.log("SUCCESS EVENT", success);
      }
    });

  userModel.findOneAndUpdate(
    { _id: idUser },
    { $pull: { favoris: idEvent } },
    function (error, success) {
      if (error) {
        console.log("ERROR USER", error);
      } else {
        console.log("SUCCESS USER", success);
      }
    });

  event = eventModel.findById(idEvent)
  user = userModel.findById(idUser)

  res.json({ event: event.popularite, user: user.favoris });
});
















// ---------------------------------------ROUTES SORTIES------------------------------------------

// ROUTE POUR CREER UNE SORTIE
// TEST POSTMAN : OK
router.post('/addSortie', async function (req, res, next) {

  var idEvenement;

  if (req.body.evenementLie == undefined) {
    idEvenement = 0
  } else {
    idEvenement = req.body.evenementLie
  }

  if (req.body.part != undefined && req.body.part.length > 1) {
    var convives = req.body.part.split(",")

    var newSortie = new sortieModel({
      evenementLie: idEvenement,
      organisateur: req.body.organisateur,
      nomSortie: req.body.nomSortie,
      image: req.body.image,
      adresse: req.body.adresse,
      cp: req.body.cp,
      date_debut: req.body.date_debut,
      date_fin: req.body.date_fin,
      duree: req.body.duree,
      type: req.body.type,
      participants: convives
    });
  } else if (req.body.part != undefined && req.body.part.length == 1) {
    var convives = req.body.part

    var newSortie = new sortieModel({
      evenementLie: idEvenement,
      organisateur: req.body.organisateur,
      nomSortie: req.body.nomSortie,
      image: req.body.image,
      adresse: req.body.adresse,
      cp: req.body.cp,
      date_debut: req.body.date_debut,
      date_fin: req.body.date_fin,
      duree: req.body.duree,
      type: req.body.type,
      participants: convives
    });
  } else {
    var newSortie = new sortieModel({
      evenementLie: idEvenement,
      organisateur: req.body.organisateur,
      nomSortie: req.body.nomSortie,
      image: req.body.image,
      adresse: req.body.adresse,
      cp: req.body.cp,
      date_debut: req.body.date_debut,
      date_fin: req.body.date_fin,
      duree: req.body.duree,
      type: req.body.type,
    });
  }

  var sortie = await newSortie.save();
  // console.log("SORTIE CREEE", sortie)

  // LE CREATEUR EST EGALEMENT UN PARTICIPANT (FACON DE RECHERCHER POUR L'ECRAN PLANIFIER), DONC ON LUI AJOUTE L'ID SORTIE DANS SES SORTIES ET IDEM POUR LES SORTIES, AJOUT DE L'ID CREATEUR
  userModel.findOneAndUpdate(
    { _id: req.body.organisateur },
    { $push: { sorties: sortie._id } },
    function (error, success) {
      if (error) {
        console.log("ERROR EVENT", error);
      } else {
        console.log("SUCCESS USER", success);
      }
    });

  sortieModel.findOneAndUpdate(
    { _id: sortie._id },
    { $push: { participants: req.body.organisateur } },
    function (error, success) {
      if (error) {
        console.log("ERROR EVENT", error);
      } else {
        console.log("SUCCESS PUSH AMIS SORTIE", success);
      }
    }
  );

  // POUR CHAQUE AMI, ON SE CONNECTE A SON PROFIL ET ON LUI AJOUTE L'ID DE LA SORTIE
  if (convives) {
    for (var idAmiSortie of convives) {
      userModel.findOneAndUpdate(
        { _id: idAmiSortie },
        { $push: { sorties: sortie._id } },
        function (error, success) {
          if (error) {
            console.log("ERROR EVENT", error);
          } else {
            console.log("SUCCESS AMIS", success);
          }
        });
    }
  }
  res.json(sortie);
});





// LECTURE D'UNE SORTIE
// TEST POSTMAN : OK
router.post('/pullSortieDetaillee', async function (req, res, next) {
  // console.log("req post id recup", req.body.id)
  var sortie = await sortieModel.findById(req.body.id)

  var listAmisSortie = [];
  for (var amis of sortie.participants) {
    var donneesAmis = await userModel.findById(amis)
    // console.log("donneesAmis",donneesAmis)
    listAmisSortie.push(donneesAmis)
  }
  // console.log("listAmisSortie ", listAmisSortie)

  res.json({ sortie, listAmisSortie });
});


// NE PLUS PARTICIPER A UNE SORTIE

router.post('/desinscription', async function (req, res, next) {

  var idUser = req.body.idUser
  var idSortie = req.body.idSortie

  userModel.findOneAndUpdate(
    { _id: idUser },
    { $pull: { sorties: idSortie } },
    function (error, success) {
      if (error) {
        console.log("ERROR EVENT", error);
      } else {
        console.log("SUCCESS USER", success);
      }
    });

  sortieModel.findOneAndUpdate(
    { _id: idSortie },
    { $pull: { participants: idUser } },
    function (error, success) {
      if (error) {
        console.log("ERROR EVENT", error);
      } else {
        console.log("SUCCESS PUSH AMIS SORTIE", success);
      }
    }
  );

  res.json()

});




// RECUPERATION DES AMIS
router.post('/pullFriendsList', async function (req, res, next) {
  // console.log("req post id recup", req.body.id)
  const user = await userModel.findById(req.body.id)

  var listAmis = [];
  for (var amis of user.amis) {
    var donneesAmis = await userModel.findById(amis)
    // console.log("donneesAmis",donneesAmis)
    listAmis.push(donneesAmis)
  }
  // console.log("listAmis ", listAmis)

  res.json({ listAmis });
});



// CHERCHER DES AMIS 
router.post('/searchFriends', async function (req, res, next) {

  try {
    // fonction pour mettre une majuscule à toute première lettre de recherche, comme dans la BDD
    function strUcFirst(a) { return (a + '').charAt(0).toUpperCase() + a.substr(1); }

    const resultatsRecherche = await userModel.find({ nom: strUcFirst(req.body.nom) })
    // const resultatsRecherche = await userModel.find({ nom: strUcFirst(req.body.nom) } $or {prenom : strUcFirst(req.body.nom)})
    res.json(resultatsRecherche);
  } catch (e) {
    console.log(e)
  }
});

// Route creation Demande  amis 
router.post('/demandeFriend', async function (req, res, next) {

  console.log();
  console.log("INDEX.JS, route: /demandeFriend");
  console.log("req.body.token=", req.body.token);
  console.log("req.body.idAmi=", req.body.idAmi);

  var result = { status: false }
  try {
    var user = await userModel.findOne({ token: req.body.token });
    console.log(user);
    const newDemande = new friendRequestModel({
      demandeur: user._id,
      receveur: req.body.idAmi,
      statut: true
    })

    result.response = await newDemande.save();
    result.status = true;
  } catch (e) {
    result.error = e;
    console.log(e);
  }
  console.log("result=", result);

  res.json(result);

});





// Route recherche les Demandes  d'amis 
router.post('/findDemandes', async function (req, res, next) {

  console.log();
  console.log("INDEX.JS, route: /findDemandes");
  console.log("req.body.token=", req.body.token);

  var result = { status: false }

  // try{
  var user = await userModel.findOne({ token: req.body.token });
  //   console.log("ROUTE FIND DEMANDES / USER._ID=>>>>>>>",user._id)
  //   result.response = await friendRequestModel.find({receveur:user._id});
  //   result.status = true;
  // }catch(e){
  //   result.error = e;
  //   console.log(e);
  // }
  // console.log("result=",result);
  // console.log()

  var listeDesDemandes = await friendRequestModel.find({ receveur: user._id })

  var idDeMesDemandeurs = []

  for (var listId of listeDesDemandes) {
    idDeMesDemandeurs.push(listId.demandeur)
  }

  console.log("idDeMesDemandeurs", idDeMesDemandeurs)

  var demandeurs = []
  for (var futursAmis of idDeMesDemandeurs) {
    var liteDesDemandes = await userModel.findById(futursAmis)
    demandeurs.push(liteDesDemandes)
  }

  console.log("demandeurs", demandeurs)

  res.json(demandeurs);

});

// Route recherche les Demandes  d'amis 
router.post('/accepteDemande', async function (req, res, next) {

  console.log();
  console.log("INDEX.JS, route: /findDemandes");
  console.log("req.body.token=", req.body.token);

  var idAmi = req.body.idDemandeur;
  var result = { status: false }
  try {
    var user1 = await userModel.findOneAndUpdate(
      { token: req.body.token },
      { $push: { amis: idAmi } }
    );
    console.log(user1);
    var idUser = user1._id;
    var user2 = await userModel.findOneAndUpdate(
      { id: idAmis },
      { $push: { amis: idUser } }
    );
    var remove = await friendRequestModel.remove({ receveur: idUser, demandeur: idAmi })
    result.status = true;
  } catch (e) {
    result.error = e;
    console.log(e);
  }
  console.log("result=", result);
  console.log()

  res.json(result);

});

// Route suppresion une Demande  d'amis 
router.post('/delDemande', async function (req, res, next) {

  console.log();
  console.log("INDEX.JS, route: /findDemandes");
  console.log("req.body.token=", req.body.token);

  var idAmi = req.body.idDemandeur;
  var result = { status: false }
  try {
    var user1 = await userModel.findOne({ token: req.body.token });
    var idUser = user1._id;
    result.response = await friendRequestModel.remove({ receveur: idUser, demandeur: idAmi })
    result.status = true;
  } catch (e) {
    result.error = e;
    console.log(e);
  }
  console.log("result=", result);
  console.log()

  res.json(result);

});




// Route pour récupérer l'ensemble des informations de l'utilisateur --> SCREEN des évènements
// TESTE POSTMAN : a faire
router.post('/pullUser', async function (req, res, next) {

  // 1. je récupère l'utilisateur et de cet utilisateur :
  //   2. mes sorties : grâce aux ids sorties stockés dans son profil, je les connecte par un for...of à  la collection sorties pour chercher les infos sorties
  //   3. mes likes : grâce aux ids favoris stockés dans son profil, je les connecte par un for...of à  la collection events pour chercher les infos evenements


  console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<< ON COMMENCE ICI >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")

  console.log(req.body.id)
  // const user = await userModel.findById( req.body.id )
  const user = await userModel.findOne({ _id: req.body.id })

  var idUser = user.id
  var mesAmis = user.amis

  // mes sorties : OK
  var mesSorties = []
  var sortiesUser = user.sorties
  for (var listSorties of sortiesUser) {
    var sorties = await sortieModel.findById(listSorties)
    mesSorties.push(sorties)
  }
  // console.log("<<<<<<<<<<<<<<<<<<<<<mes sorties ",mesSorties)

  // mes likes (OK)
  const mesLikes = await eventModel.find({ popularite: idUser })
  // console.log("mesLikes ", mesLikes)



  //   4. sorties des amis : 
  //     4.a : je récupère via les ids des amis leurs ids de sorties, 
  //     4.b : puis recherche par ami pour intégrer dans un tableau d'id les idsorties 
  //     4.c : je dédoublonne les id de sorties
  //     4.d : je fais une recherche pour chaque id dans la collection sortie pour récuperer les infos (dont la liste d'amis contenue): tableau d'objet
  //     4.e : pour savoir ce que je dois envoyer, je filtre sur le type et si en privée, je vérifie si l'id sortie privée fait partie des id sorties de l'utilisateur

  var idDesSorties = []


  for (var listAmis of mesAmis) {
    console.log("listAmis: ", listAmis)
    var listsortiesami = await userModel.findById(listAmis)
    console.log("listsortiesami: ", listsortiesami)
    var listingsorties = listsortiesami.sorties
    console.log("listingsorties: ", listingsorties)
    idDesSorties.push(listingsorties)
  }

  // console.log("idDesSorties: ", idDesSorties)

  var idDesSortiesConcatDoublons = []

  for (var i = 0; i < idDesSorties.length; i++) {
    idDesSortiesConcatDoublons = idDesSortiesConcatDoublons.concat(idDesSorties[i])
  }
  console.log("idDesSortiesConcat: ", typeof (idDesSortiesConcatDoublons))

  console.log("idDesSortiesConcatDoublons: ", idDesSortiesConcatDoublons);

  // SUPPRESSION DE DOUBLONS
  function cleanArray(array) {
    var idDesSortiesConcatSansDoublons = []
    // var i, j, len = array.length, out = [], obj = {};
    // for (i = 0; i < len; i++) {
    //   obj[array[i]] = 0;
    // }
    // for (j in obj) {
    //   out.push(j);
    // }
    for (var i = 0; i < array.length; i++) {

      if (idDesSortiesConcatSansDoublons.indexOf(array[i]) == -1) {
        idDesSortiesConcatSansDoublons.push(array[i])
      }
    }
    return idDesSortiesConcatSansDoublons;
  }

  var idDesSortiesConcatSansDoublons = cleanArray(idDesSortiesConcatDoublons);
  console.log("idDesSortiesConcatSansDoublons: ", idDesSortiesConcatSansDoublons);



  // RECUP DES INFOS SORTIES
  var sortiesAmis = []
  for (var sorts of idDesSortiesConcatSansDoublons) {
    var sortiesami = await sortieModel.findById(sorts)
    if (sortiesami !== null) {
      sortiesAmis.push(sortiesami)
      console.log("sortiesAmis: ", sortiesAmis)
    }
  }

  // VERIF DU TYPE ET S'IL FAUT AFFICHER OU NON A L'UTILISATEUR
  // var sortiesAffichees = []

  // for (var sortiees of sortiesAmis) {
  //   // console.log(sortiees.type)
  //   if (sortiees.type != "privée") {
  //     // console.log("OPEN SORTIE")
  //     sortiesAffichees.push(sortiees)
  //   } else {
  //     for (var j = 0; j < sortiesUser.length; j++) {
  //       if (sortiees.id == sortiesUser[j]) {
  //         console.log("id ami", sortiees.id, "========= id user", sortiesUser[j])
  //         console.log("privée mais OK")
  //         sortiesAffichees.push(sortiees)
  //       } else {
  //         console.log("SOIREE PRIVEE", "id ami", sortiees.id, "========= id user", sortiesUser[j])
  //       }
  //     }
  //   }
  // }

  // console.log("sortiesAffichees", sortiesAffichees)

  //   5. likes des amis : MEME LOGIQUE QUE POUR LA SORTIE

  // RECUPERATION DES ID EVENEMENTS FAVORIS DES AMIS
  var amisLikes = []
  for (var rechamilikes of mesAmis) {
    var transamisLikes = await userModel.findById(rechamilikes)
    if (transamisLikes !== null) {
      // console.log("rechamilikes", rechamilikes)
      // console.log("LIKES FOUND", transamisLikes)
      amisLikes.push(transamisLikes.favoris)
    }
  }
  // console.log("amisLikes ", amisLikes)

  //DEDOUBLONNEMENT
  var idDesLikesConcatDoublons = []

  for (var i = 0; i < amisLikes.length; i++) {
    idDesLikesConcatDoublons = idDesLikesConcatDoublons.concat(amisLikes[i])
  }
  // console.log("idDesSortiesConcat", idDesLikesConcatDoublons)

  var idDesLikesConcatSansDoublons = cleanArray(idDesLikesConcatDoublons);
  // console.log("idDesLikesConcatSansDoublons", idDesLikesConcatSansDoublons);

  //RECHERCHE DES ELEMENTS EVENEMENTS DES IDS DEDOUBLONNES DES AMIS
  var LikesDesAmis = []
  for (var likess of idDesLikesConcatSansDoublons) {
    var likessami = await eventModel.findById(likess)
    if (likessami !== null) {
    LikesDesAmis.push(likessami)
    }
  }
  // console.log("LikesDesAmis", LikesDesAmis)

  res.json({ user, mesSorties, mesLikes, sortiesAmis, LikesDesAmis })

});


















// ---------------------------------------ADMINISTRATION DE LA BDD VIA POSTMAN------------------------------------------


router.get('/delUndefinedFromPopularite', async function (req, res, next) {

  var events = await eventModel.find();

  var compt = 0;
  for (let even of events){
    var newPopularite = [];
    await eventModel.updateOne({id : even._id}, {popularite : newPopularite})
    compt ++;
    
  }

  console.log('new base de donne compt', compt , ' evenements');


});

















// ---------------------------------------ADMINISTRATION DE LA BDD VIA POSTMAN------------------------------------------
router.post('/addevent', async function (req, res, next) {
  //Ajout d'un évènement avec un créneau 
  var newEvent = new eventModel({
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
      duree: req.body.duree
    }],

  });

  var event = await newEvent.save();
  res.render('index', { event: event });
});


router.post('/addeventlieu', async function (req, res, next) {
  //Ajout de créneaux à un évènement spécifique via son id
  var idEvenement = '5fce47f76697a656d4d4ea77'
  eventModel.findOneAndUpdate(
    { _id: idEvenement },
    {
      $push: {
        lieux_dates: {
          salle: req.body.salle,
          adresse: req.body.adresse,
          cp: req.body.cp,
          date_debut: req.body.dateDebut,
          date_fin: req.body.dateFin,
          duree: req.body.duree
        }
      }
    },
    function (error, success) {
      if (error) {
        console.log("ERROR", error);
      } else {
        console.log("SUCCESS", success);
      }
    });

  res.render('index');
});


router.post('/addsortie', async function (req, res, next) {
  //Ajout d'un évènement avec un créneau 
  var newSortie = new sortieModel({
    evenementLie: req.body.evenementLie,
    organisateur: req.body.organisateur,
    nomSortie: req.body.nomSortie,
    adresse: req.body.adresse,
    cp: req.body.cp,
    date_debut: req.body.debut,
    date_fin: req.body.fin,
    duree: req.body.duree,
    type: req.body.type,
    participants: req.body.part

  });

  var sortie = await newSortie.save();
  res.render('index', { sortie });
});



module.exports = router;
