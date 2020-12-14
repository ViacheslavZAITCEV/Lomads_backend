var mongoose = require('./connection')


var lieuxDatesSchema = mongoose.Schema({
    salle: String,
    adresse: String,
    cp: String,
    date_debut: Date,
    date_fin: Date,
    duree: Number,
})


var eventSchema = mongoose.Schema({
    nom: String,
    type: String,
    categories: [String],
    description: String,
    image: String,
    image_public_id: String,
    popularite: [String],
    lieux_dates: [lieuxDatesSchema],
})

var eventModel = mongoose.model('events', eventSchema)

module.exports = eventModel;