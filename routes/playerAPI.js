var express = require('express');
var db = require('../db.js');
var router = express.Router();

router.get('/', function(req, res, next) {
  db.query("SELECT * FROM players;",
    function(err) {
      res.render("error", {message: err.message, error: err});
    },
    function(result) {
      res.render('results', { results: result });
    });
});

router.get('/view/:attributes/:conditions/:operators/:constraints/:logic', function(req, res, next) {

  // these are the attributes we want to include in query
  var attributes = req.params["attributes"].split('-');

  if("conditions" in req.params){
    var conditions = req.params["conditions"].split('-');
    var operators = req.params["operators"].split('-');
    var constraints = req.params["constraints"].split('-');

    if(conditions.length != operators.length || conditions.length != constraints.length)
      return "error";
  }

  if("logic" in req.params){
    var logic = req.params["logic"].split('-');
  }

  var sqlQuery = (attributes.length == 2 && attributes[1] == "") ? "SELECT player_id, name FROM players WHERE " :
    "SELECT player_id, name, " + attributes.join(", ") + " FROM players WHERE ";

  for (var i = 0; i < operators.length; i++) {
    if (operators[i] == "eq")
      operators[i] = "=";

    if(i == conditions.length - 1) {
      sqlQuery += conditions[i] + operators[i] + constraints[i] + ";";
    }
    else {
      sqlQuery += conditions[i] + operators[i] + constraints[i] + " " + logic[i] + " ";
    }
  }

  db.query(sqlQuery,
    function(err) {
      res.render('error', { message: err.message, error: err });
    },
    function(result) {
      res.render('results', { results: result });
    });
});

router.get('/update/:teamID/:playerID/:jerseyNum/:position/:suspended/:injured', function(req, res, next) {
  var teamID = (req.params["teamID"] == "tid:") ? "" : req.params["teamID"].substr(4);
  var jerseyNum = (req.params["jerseyNum"] == "jn:") ? "" : req.params["jerseyNum"].substr(3);
  var position = (req.params["position"] == "pos:") ? "" : req.params["position"].substr(4);
  var suspended = (req.params["suspended"] == "sus:") ? "" : req.params["suspended"].substr(4);
  var injured = (req.params["injured"] == "inj:") ? "" : req.params["injured"].substr(4);

  var playerID = req.params["playerID"].substr(4);

  var sqlQuery = "UPDATE players SET ";
  sqlQuery = (teamID == "") ? sqlQuery : sqlQuery + 'team_id = ' + teamID + ', ';
  sqlQuery = (jerseyNum == "") ? sqlQuery : sqlQuery + 'jersey_number = ' + jerseyNum + ', ';
  sqlQuery = (position == "") ? sqlQuery : sqlQuery + 'position = ' + position + ', ';
  sqlQuery = (suspended == "") ? sqlQuery : sqlQuery + 'suspended = ' + suspended + ', ';
  sqlQuery = (injured == "") ? sqlQuery : sqlQuery + 'injured = ' + injured + ', ';

  if (sqlQuery.charAt(sqlQuery.length - 2) == ',')
    sqlQuery = sqlQuery.substr(0, sqlQuery.length - 2);

  sqlQuery = sqlQuery + ' WHERE player_id = ' + playerID + ';';

  console.log(sqlQuery);

  db.query(sqlQuery, 
    function(err) {
      res.render("error", {message: err.message, error: err});
    },
    function(result) {
      res.redirect('/players');
    }
  );

});

router.get('/add/:teamID/:name/:jerseyNum/:position', function(req, res, next) {
  var teamID = req.params["teamID"];
  var playerName = decodeURIComponent(req.params["name"]);
  var jerseyNum = req.params["jerseyNum"];
  var pos = req.params["position"];

  var sqlQuery = "INSERT INTO players (team_id, name, jersey_number, position) VALUES (" + teamID + ',' + "'" + playerName + "'" + ',' + 
    jerseyNum + ',' + pos + ');';
 
  db.query(sqlQuery, 
    function(err) {
      res.render('error', { message: err.message, error: err });
    },
    function(result) {
      res.redirect('/players');
    }
  );
});

router.get('/delete/:playerID', function(req, res, next) {
  var playerID = req.params.playerID;

  db.query("delete from players where player_id = " + playerID + ";",
    function(err) {
      res.render("error", {message: err.message, error: err});
    },
    function(result) {
      res.redirect('/players');
    }
  );
});

module.exports = router;
