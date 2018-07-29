var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/weight-tracking", {
  useNewUrlParser: true
 });

var trackerSchema = new mongoose.Schema({
   weight: {
     type: Number,
     required: [true, 'Please provide weight']
   },
   date: {
     type: Date,
     default: Date.now
   }
 });
 
module.exports = mongoose.model('Tracker', trackerSchema);
