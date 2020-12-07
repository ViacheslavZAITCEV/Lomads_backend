const mongoose = require("./connection");

const user = {
    salt : String,
    token : String,
    nom : String,
    prenom : String,
    email : String,
    password : String,
    avatar : String,
    ville : String,
    age : Number,
    amis : Array,
    groupes : Array,
    conversations : Array,
    preferences : String,
    confidentialite : String,
    favoris : Array,
    sorties : Array,
}

var users = mongoose.model('users', mongoose.Schema(user));

module.exports = users;