const mongoose = require('mongoose');

// useNewUrlParser ;)
var options = {
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useUnifiedTopology: true
 };

// --------------------- BDD -----------------------------------------------------
mongoose.connect('mongodb+srv://teamGoWizMe:xdGu0Lo0XyuATGtK@cluster0.ahojw.mongodb.net/GoWizMe?retryWrites=true&w=majority',
   options,
   function(err) {
    if (err) {
      console.log(`error, failed to connect to the database because --> ${err}`);
    } else {
      console.info('*** Database GoWizMe connection : Success ***');
    }
   }
);

module.exports = mongoose
