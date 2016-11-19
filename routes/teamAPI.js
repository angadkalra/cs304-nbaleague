var express = require('express');
var db = require('../db');

var router = express.Router();

router.get('/', function(req, res, next) {
  var query = 'SELECT * FROM teams WHERE deleted != 1;';

  db.query(query, 
    function(err){
      res.render('error', { message: err.message, error: err });
    },
    function(result){
      res.render('results', { results:result });
    });
});

router.get('/include-deleted', function(req, res, next) {
  var query = 'SELECT * FROM teams;';

  db.query(query, 
    function(err){
      res.render('error', { message: err.message, error: err });
    },
    function(result){
      res.render('results', { results:result });
    });
});

router.get('/consistent-teams/:score', function(req, res, next) {
  db.query("SELECT team_id, name FROM teams WHERE team_id IN (SELECT id FROM (SELECT id, score FROM (SELECT home_team_id as id, home_score as score FROM results UNION ALL SELECT away_team_id as id, away_score as score FROM results) as scores GROUP BY id HAVING MIN(score) > " + req.params.score + ") as ids)",
    function(err) {
      res.render('error', { message: err.message, error: err })
    },
    function(result) {
      res.render('results', { results: result });
    });
});


module.exports = router;
