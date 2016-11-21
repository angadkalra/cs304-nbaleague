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

router.get('/allscores/:logic/:score', function(req,res,next){
  var aggr="";
  if(req.params["logic"]=="eq"){
    req.params["logic"]="=";
    aggr="";
  }else if( req.params["logic"]=="lt"){
    req.params["logic"]="<";
    aggr="MAX";
  }else if( req.params["logic"]=="lte"){
    req.params["logic"]="<=";
    aggr="MAX";
  }else if( req.params["logic"]=="gt"){
    req.params["logic"]=">";
    aggr="MIN";
  }else if( req.params["logic"]=="gte"){
    req.params["logic"]=">=";
    aggr="MIN";
  }else{
    return "error";
  }
  db.query('SELECT name as Team FROM teams WHERE team_id IN '+ 
           '('+
	     'SELECT id FROM '+
	     '('+
	       'SELECT id, score FROM ('+
	         'SELECT home_team_id as id, home_score as score FROM results '+
	         'UNION ALL '+
	         'SELECT away_team_id as id, away_score as score FROM results'+
	       ') as scores '+
	       'GROUP BY id '+
	       'HAVING '+aggr+'(score)'+req.params["logic"]+req.params["score"]+
	     ') as ids'+
	   ')',
    function(err){
      res.render('error', {message: err.message, error: err});
    },
    function(result){
      res.render('results', {results:result});
    });	     

});
router.get('/:attributes/', function(req,res,next){
  if(req.params["attributes"]=="averages" || req.params["attributes"]=="winsandlosses" ||req.params["attributes"]=="include-deleted" || req.params["attributes"]=="blowouts" || req.params["attributes"]=="close-games"){
    return next();
  }
  helpers.querySelectAndRoute('teams', req,res,next);
});  


router.get('/:attributes/:conditions/:operators/:boundaries', function(req,res,next){
  helpers.querySelectAndRoute('teams', req,res,next);
});  

router.get('/averages', function(req,res,next){
  db.query('SELECT teams.name as Teams, averages.average as "Average Points" FROM teams, '+
           '('+
	     'SELECT AVG(score) as average, id FROM'+
	     '('+
	       'SELECT home_team_id as id, home_score as score FROM results '+
	       'UNION ALL '+
	       'SELECT away_team_id as id, away_score as score FROM results '+
	     ') as scores '+
	     'GROUP BY id '+
	   ') as averages '+
	   'WHERE teams.team_id=averages.id;',
    function(err){
      res.render('error', {message: err.message, error: err});
    },
    function(result){
      res.render('results', {results:result});
    });	    
});

router.get('/winsandlosses',  function(req,res,next){
  db.query('SELECT teams.name as Teams, SUM(result.wins) as Wins, SUM(result.losses) as Losses FROM teams, '+
           '('+
	     'SELECT * FROM'+
	     '('+
	       'SELECT home_team_id as id, count(home_team_id) as wins, "0" as losses FROM results WHERE home_score>away_score  group by home_team_id '+
	       'UNION ALL '+
	       'SELECT away_team_id as id, count(away_team_id) as wins, "0" as losses FROM results WHERE away_score>home_score group by away_team_id '+
	       'UNION ALL '+
	       'SELECT home_team_id as id, "0" as wins, count(home_team_id) as losses FROM results WHERE home_score<away_score group by home_team_id '+
	       'UNION ALL '+
	       'SELECT away_team_id as id, "0" as wins, count(away_team_id) as losse FROM results WHERE away_score<home_score group by away_team_id'+
	     ') as winsandlosses '+
	   ') as result '+
	   'WHERE teams.team_id=result.id '+
	   'group by teams.name;',

    function(err){
      res.render('error', {message: err.message, error: err});
    },
    function(result){
      res.render('results', {results:result});
    });	    
});


module.exports = router;
