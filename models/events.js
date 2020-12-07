<<<<<<< HEAD
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
=======
// var mongoose = require('./connection')

// var eventSchema = mongoose.Schema({
//     name: String,
//     firstname: String,
//     email: String,
//     password: String,
// })

// var eventModel = mongoose.model('events', eventSchema)

// module.exports = eventModel;
>>>>>>> 404648db91dfcc2c85cdd28a8a44ea9ac04731e9
