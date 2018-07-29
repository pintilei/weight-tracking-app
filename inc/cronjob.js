//Set CronJob to send daily reminder email if there are no logs for that day
var CronJob = require('cron').CronJob;
var nodemailer = require('nodemailer');
var moment = require('moment');

module.exports = (Tracker) => {
  new CronJob('00 30 19 * * 0-6', () => { // 19:30, each day
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

              transporter.sendMail(mailOptions, (error, info) => {
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
}
