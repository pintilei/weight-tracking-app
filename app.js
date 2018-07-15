var express = require('express');
var app = express();
var port = 3000;

// Set the static directory for assets
app.use(express.static(__dirname + '/public'));

// Set view engine
app.set('view engine', 'ejs');

// Routes
app.get('/', function(req, res){
  res.render('pages/index');
});

app.listen(3000, () => console.log('App listening on port 3000'));
