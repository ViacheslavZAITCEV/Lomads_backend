var mongoose = require('./connection')

var friendRequestSchema  = mongoose.Schema({
    demandeur: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    receveur: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    statut: Boolean
    })

var friendRequestModel = mongoose.model('friendRequests', friendRequestSchema)

module.exports = friendRequestModel;