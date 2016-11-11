var express = require('express');
var db = require('../db.js');
var router = express.Router();

router.get('/admin', function(req, res, next) {
  res.render('admin');
});

router.get('/coach', function(req, res, next) {
  res.render('coach');
});

router.get('/general', function(req, res, next) {
  res.render('general');
});

// Redirect / to /admin
router.get('/', function(req, res, next){
  res.redirect('/admin');
});

// Routes that might want to me moved out of here
router.get('/players', function(req, res, next) {
    db.query("SELECT * FROM players;",
    function(err) {
      console.log(err);
    },
    function(result) {
      res.render('players', { players: result });
    });
});

router.get('/players/player/:id', function(req, res, next) {
  db.query("SELECT * FROM players WHERE player_id = " + req.params.id + ";",
  function(err) {
    console.log(err);
  },
  function(result) {
    res.render('players', { players: result });
  });
});

router.get('/players/team/:id', function(req, res, next) {
  db.query("SELECT * FROM players WHERE team_id = " + req.params.id + ";",
  function(err) {
    console.log(err);
  },
  function(result) {
    res.render('players', { players: result });
  });
});

module.exports = router;
