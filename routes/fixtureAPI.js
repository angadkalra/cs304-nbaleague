var express = require('express');
var db = require('../db.js');
var router = express.Router();

router.get('/:date?', function(req, res, next) {
  if (req.params.date == 'blowouts' || req.params.date == 'close-games') {
    return next();
  }

  db.query("SELECT team_plays_team.*, results.home_score, results.away_score FROM team_plays_team LEFT JOIN results "
    + "ON team_plays_team.date = results.date "
    + "AND team_plays_team.home_team_id = results.home_team_id "
    + "AND team_plays_team.away_team_id = results.away_team_id "
    + (req.params.date ? "WHERE team_plays_team.date = '" + req.params.date + "'" : ""),
    function(err) {
      res.render('error', { message: err.message, error: err });
    },
    function(result) {
      res.render('results', { results: result });
    });
});

router.get('/add/:date/:home_team_id/:away_team_id', function(req, res, next) {
  db.query("INSERT INTO team_plays_team (date, home_team_id, away_team_id) "
    + "VALUES ('" + req.params.date + "'," + req.params.home_team_id + "," + req.params.away_team_id + ")",
    function(err) {
      res.render('error', { message: err.message, error: err });
    },
    function(result) {
      res.redirect('/fixtures');
    });
});

router.get('/result/edit/:date/:home_team_id/:away_team_id/:home_score/:away_score', function(req, res, next) {
  db.query("SELECT * FROM results "
    + "WHERE date = '" + req.params.date + "' "
    + "AND home_team_id = " + req.params.home_team_id + " "
    + "AND away_team_id = " + req.params.away_team_id,
    function(err) {
      res.render('error', { message: err.message, error: err });
    },
    function(results) {
      if (results.length == 0) {
        db.query("INSERT INTO results (date, home_team_id, away_team_id, home_score, away_score) "
          + "VALUES ('" + req.params.date + "'," + req.params.home_team_id + "," + req.params.away_team_id + "," + req.params.home_score + "," + req.params.away_score + ")",
          function(err) {
            res.render('error', { message: err.message, error: err });
          },
          function(result) {
            res.redirect('/fixtures');
          });
      } else {
        db.query("UPDATE results " +
          "SET home_score = " + req.params.home_score + ", away_score = " + req.params.away_score + " "
          + "WHERE date = '" + req.params.date + "' "
          + "AND home_team_id = " + req.params.home_team_id + " "
          + "AND away_team_id = " + req.params.away_team_id,
          function(err) {
            res.render('error', { message: err.message, error: err });
          },
          function(result) {
            res.redirect('/fixtures');
          });
      }
    });
});

router.get('/delete/:date/:home_team_id/:away_team_id', function(req, res, next) {
  db.query("DELETE FROM team_plays_team "+
           "WHERE date = '"+req.params.date+"' "+
	   "AND home_team_id = " + req.params.home_team_id + " "+
           "AND away_team_id = " + req.params.away_team_id,
           function(err) {
              res.render('error', { message: err.message, error: err });
            },
           function(result) {
             res.redirect('/fixtures');
           });
});

router.get('/blowouts', function(req, res, next) {
  db.query("SELECT * FROM results WHERE ABS(home_score-away_score) = (SELECT MAX(ABS(home_score-away_score)) FROM results);",
    function(err) {
      res.render('error', { message: err.message, error: err });
    },
    function(result) {
      res.render('results', { results: result });
    });
});

router.get('/close-games', function(req, res, next) {
  db.query("SELECT * FROM results WHERE ABS(home_score-away_score) = (SELECT MIN(ABS(home_score-away_score)) FROM results);",
    function(err) {
      res.render('error', { message: err.message, error: err });
    },
    function(result) {
      res.render('results', { results: result });
    });
});

module.exports = router;
