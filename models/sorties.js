var mongoose = require('./connection')

var sortieSchema = mongoose.Schema({
    evenementLie: [{ type: mongoose.Schema.Types.ObjectId, ref: 'events' }],
    organisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    nomSortie: String,
    adresse: String,
    cp: String,
    date_debut: Date,
    date_fin: Date,
    duree: Number,
    type: String,
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
})


var sortieModel = mongoose.model('sorties', sortieSchema)

module.exports = sortieModel;