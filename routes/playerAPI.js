var express = require('express');
var db = require('../db.js');
var router = express.Router();

router.get('/', function(req, res, next) {
  db.query("SELECT * FROM players;",
    function(err) {
      console.log(err);
    },
    function(result) {
      res.render('results', { results: result });
    });
});

router.get('/player/:id', function(req, res, next) {
  db.query("SELECT * FROM players WHERE player_id = " + req.params.id + ";",
    function(err) {
      console.log(err);
    },
    function(result) {
      res.render('results', { results: result });
    });
});

router.get('/team/:id', function(req, res, next) {
  db.query("SELECT * FROM players WHERE team_id = " + req.params.id + ";",
    function(err) {
      console.log(err);
    },
    function(result) {
      res.render('results', { results: result });
    });
});

module.exports = router;
