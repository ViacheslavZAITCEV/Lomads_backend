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
    // REVOIR A UN MOMENT LES PREFERENCES POUR FAIRE UN TABLEAU D'OBJETS
    // ex :  updated: { type: Date, default: Date.now },
    preferences: [String],
    confidentialite: Boolean,
    favoris: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
    // sorties : [{ type: mongoose.Schema.Types.ObjectId, ref: 'sorties' }],
    // groupes_amis:[{ type: mongoose.Schema.Types.ObjectId, ref: 'friends' }],
    // conversations:[{ type: mongoose.Schema.Types.ObjectId, ref: 'conversations' }]
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;