var mongoose = require('./connection')

var userSchema = mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    mot_de_passe: String,
    token: String,
    salt: String,
    avatar: String,
    date_de_naissance: Date,
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
})

var userModel = mongoose.model('users', userSchema)

module.exports = userModel;