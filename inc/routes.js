module.exports = (app, Tracker) => {
  app.get('/', (req, res) => {
    Tracker.find({}).sort('-date').exec((err, trackerLogs) => {
        res.render('pages/index', { trackerLogs: trackerLogs })
    });
  });

  app.get('/track', (req, res) => {
    res.render('pages/track');
  });

  app.post('/track', (req, res) => {
      var trackerData = new Tracker(req.body);
      var error = trackerData.validateSync();

      trackerData.save().then( result => {
          res.redirect('/');
      }).catch(err => {
          res.status(400).send("Unable to save data");
      });
  });
}
