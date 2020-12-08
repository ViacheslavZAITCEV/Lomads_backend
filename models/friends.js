var mongoose = require('./connection')

var friendSchema = mongoose.Schema({
    createur: String,
    nom: String,
    membres: [String],
})

var friendModel = mongoose.model('friends', friendSchema)

module.exports = friendModel;