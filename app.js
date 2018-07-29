require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser')
var app  = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

var Tracker = require('./inc/schema');
var routes  = require('./inc/routes')(app, Tracker)
var cronjob = require('./inc/cronjob')(Tracker);

app.listen(port, () => console.log('App listening on port', port));
