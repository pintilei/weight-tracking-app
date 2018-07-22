require('dotenv').load();
var express = require('express');
var moment = require('moment');
var app = express();
var port = process.env.PORT || 3000;

var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// Connect to mongodb using mongoose
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/weight-tracking", {
    useNewUrlParser: true
});

//Set CronJob to send daily reminder email if there are no logs for that day
var CronJob = require('cron').CronJob;
var nodemailer = require('nodemailer');

new CronJob('00 30 19 * * 0-6', function () { // 19:30, each day
    console.log('Start cron job...');

    var start = moment().startOf('day');
    var end = moment().endOf('day');

    Tracker.find({
        "date": {$gte: start, $lt: end}
    }).countDocuments((err, count) => {
        if (!count) {

            console.log(count + ' results found, should send notification email');

            var transporter = nodemailer.createTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secure: true,
                auth: {
                    user: process.env.MAIL_AUTH_USER,
                    pass: process.env.MAIL_AUTH_PASS
                }
            });

            var mailOptions = {
                from: process.env.MAIL_AUTH_USER,
                to: process.env.MAIL_RECEIVER,
                subject: 'New message from Weight Tracker',
                text: 'Don\'t forget to fill in your weight.'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        } else {
            console.log(count + ' results found, do not send notification email');
        }
    });
}, null, true, 'Europe/Bucharest');

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
app.get('/', function (req, res) {
    Tracker.find({}).sort('-date').exec((err, trackerLogs) => {
        res.render('pages/index', {trackerLogs: trackerLogs})
    });
});

app.get('/track', function (req, res) {
    res.render('pages/track');
});

app.post('/track', function (req, res) {
    var trackerData = new Tracker(req.body);
    trackerData.save().then(result => {
        res.redirect('/');
    }).catch(err => {
        res.status(400).send(err);
    });
});

app.listen(port, () => console.log('App listening on port', port));
