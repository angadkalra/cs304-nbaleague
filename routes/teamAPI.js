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

router.get('/consistent-teams/:logic/:score', function(req,res,next){
  var aggregateFunction, comparator;
  if (req.params.logic.startsWith('lt')) {
    aggregateFunction  = 'MAX';
    comparator = '<';
  } else {
    aggregateFunction  = 'MIN';
    comparator = '>';
  }

  if (req.params.logic.endsWith('e')) {
    comparator += '=';
  }

  db.query('SELECT team_id, name FROM teams WHERE team_id IN '+
           '('+
	     'SELECT id FROM '+
	     '('+
	       'SELECT id, score FROM ('+
	         'SELECT home_team_id AS id, home_score AS score FROM results '+
	         'UNION ALL '+
	         'SELECT away_team_id AS id, away_score AS score FROM results'+
	       ') AS scores '+
	       'GROUP BY id ' +
	       'HAVING ' + aggregateFunction + '(score)' + comparator + ' ' + req.params.score +
	     ') AS ids'+
	   ')',
    function(err){
      res.render('error', {message: err.message, error: err});
    },
    function(result){
      res.render('results', {results:result});
    });
});

router.get('/averages', function(req,res,next){
  db.query('SELECT teams.team_id, teams.name, averages.average FROM teams, '+
           '('+
       'SELECT AVG(score) AS average, id FROM'+
       '('+
         'SELECT home_team_id AS id, home_score AS score FROM results '+
         'UNION ALL '+
         'SELECT away_team_id AS id, away_score AS score FROM results '+
       ') AS scores '+
       'GROUP BY id '+
     ') AS averages '+
     'WHERE teams.team_id=averages.id;',
    function(err){
      res.render('error', { message: err.message, error: err });
    },
    function(result){
      res.render('results', { results:result });
    });     
});

router.get('/wins-and-losses',  function(req, res, next){
  db.query('SELECT teams.team_id AS team_id, teams.name AS name, SUM(result.wins) AS wins, SUM(result.losses) AS losses FROM teams, '+
           '('+
	     'SELECT * FROM'+
	     '('+
	       'SELECT home_team_id AS id, COUNT(home_team_id) AS wins, "0" AS losses FROM results WHERE home_score>away_score  GROUP BY home_team_id '+
	       'UNION ALL '+
	       'SELECT away_team_id AS id, COUNT(away_team_id) AS wins, "0" AS losses FROM results WHERE away_score>home_score GROUP BY away_team_id '+
	       'UNION ALL '+
	       'SELECT home_team_id AS id, "0" AS wins, COUNT(home_team_id) AS losses FROM results WHERE home_score<away_score GROUP BY home_team_id '+
	       'UNION ALL '+
	       'SELECT away_team_id AS id, "0" AS wins, COUNT(away_team_id) AS losses FROM results WHERE away_score<home_score GROUP BY away_team_id'+
	     ') AS winsandlosses '+
	   ') AS result '+
	   'WHERE teams.team_id=result.id '+
	   'GROUP BY teams.name;',
    function(err){
      res.render('error', {message: err.message, error: err});
    },
    function(result){
      res.render('results', {results:result});
    });
});


module.exports = router;
