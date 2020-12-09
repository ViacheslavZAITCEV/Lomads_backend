var mongoose = require('./connection')

var userSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    mot_de_passe: String,
    ville: String,
    token : String,
    salt: String,
    avatar: String,
    date_de_naissance : Date,
    amis: [String],
    // Format Tableau d'objets dans lequel on déclare chaque donnée et son type
    preferences: [{
        //TYPES --> A faire évoluer selon la vie du projet, si on ajoute d'autres types (festivals, etc.)
        cinema : Boolean,
        theatre: Boolean,
        exposition: Boolean,
        concert: Boolean,
        //CATEGORIES --> A faire évoluer selon la vie du projet, si on ajoute d'autres categories (action, policier, etc.)
        fantastique: Boolean,
        scienceFiction:  Boolean,
        comedie: Boolean,
        drame: Boolean,
        spectacleMusical: Boolean,
        contemporain: Boolean,
        oneManShow: Boolean,
        musiqueClassique: Boolean,
        musiqueFrancaise: Boolean,
        musiquePop: Boolean,
        musiqueRock: Boolean,
        beauxArts : Boolean,
        histoireCivilisations: Boolean,
    }],
    confidentialite: Boolean,
    favoris: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
    // CREATION DES CLEFS ETRANGERES POUR LA SUITE DU PROJET, A DECOMMENTER DES BESOIN
    // sorties : [{ type: mongoose.Schema.Types.ObjectId, ref: 'sorties' }],
    // groupes_amis:[{ type: mongoose.Schema.Types.ObjectId, ref: 'groups' }],
    // conversations:[{ type: mongoose.Schema.Types.ObjectId, ref: 'conversations' }]
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;

