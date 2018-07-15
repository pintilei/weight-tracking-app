var express = require('express');
var app = express();
var port = 3000;

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true}))

// Connect to mongodb using mongoose
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/weight-tracking", {
  useNewUrlParser: true
 });

// Set database schema
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
var Tracker = mongoose.model('Tracker', trackerSchema);

// Set the static directory for assets
app.use(express.static(__dirname + '/public'));

// Set view engine
app.set('view engine', 'ejs');

// Routes
app.get('/', function(req, res){
  Tracker.find({}).sort('-date').exec((err, trackerLogs) => {
      res.render('pages/index', { trackerLogs: trackerLogs })
  });
});

app.get('/track', function(req, res){
  res.render('pages/track');
});

app.post('/track', function(req, res){
  var trackerData = new Tracker(req.body);

    var error = trackerData.validateSync();
    console.log(error);

    trackerData.save().then( result => {
        res.redirect('/');
    }).catch(err => {
        res.status(400).send("Unable to save data");
    });
});

app.listen(port, () => console.log('App listening on port', port));
