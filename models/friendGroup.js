var mongoose = require('./connection')

var groupSchema = mongoose.Schema({
    createur: String,
    nom: String,
    membres: [String],
})

var groupModel = mongoose.model('groups', groupSchema)

module.exports = groupModel;